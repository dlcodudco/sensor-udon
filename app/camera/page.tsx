'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Video, Camera, Pause, Play } from 'lucide-react'; 

// 팀원이 설정한 주소들
const LIVE_PAGE = 'https://sensorudon-backend.onrender.com/camera/live';
const LATEST_JPG = 'https://sensorudon-backend.onrender.com/camera/latest.jpg';

interface HistoryEvent {
  id: number;
  timestamp: string;
  eventType: '충격' | '기울기' | '수동캡처' | '배송시작' | '배송완료';
  eventValue: number;
  message: string;
  isAlert: boolean;
  imageUrl?: string;
}

// [추가됨] 한국 시간(KST) 기준으로 ISO 문자열을 만드는 함수
const getLocalISOString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().slice(0, -1);
};

export default function CameraPage() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('isStreaming');
    const on = saved === 'true';
    setIsStreaming(on);
    setNonce(Date.now());

    const decide = () => setIsMobile(window.innerWidth <= 768);
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, []);

  useEffect(() => {
    if (!mounted || !isMobile || !isStreaming || !playing) return;
    const id = setInterval(() => setNonce(Date.now()), 300);
    return () => clearInterval(id);
  }, [mounted, isMobile, isStreaming, playing]);

  const iframeSrc = useMemo(() => {
    if (!mounted) return LIVE_PAGE;
    return `${LIVE_PAGE}${LIVE_PAGE.includes('?') ? '&' : '?'}t=${nonce}`;
  }, [mounted, nonce]);

  const imgSrc = useMemo(() => {
    if (!mounted) return LATEST_JPG;
    return `${LATEST_JPG}${LATEST_JPG.includes('?') ? '&' : '?'}t=${nonce}`;
  }, [mounted, nonce]);

  const toggleStream = () => {
    const next = !isStreaming;
    setIsStreaming(next);
    localStorage.setItem('isStreaming', next.toString());
    setSnapshotUrl(null);
    if (next) setNonce(Date.now());
  };

  const handleCaptureSnapshot = async () => {
    if (!isStreaming) return;
    
    setIsCapturing(true);

    let imageBase64 = '/images/box.png';

    try {
      const response = await fetch(`${LATEST_JPG}?t=${Date.now()}`);
      const blob = await response.blob();
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("캡처 변환 실패:", e);
    }

    setSnapshotUrl(imageBase64);

    const newEvent: HistoryEvent = {
      id: Date.now(),
      // [수정됨] 기존 new Date().toISOString() 대신 로컬 시간 함수 사용
      timestamp: getLocalISOString(), 
      eventType: '수동캡처',
      eventValue: 0,
      message: '사용자가 카메라 화면에서 직접 캡처했습니다.',
      isAlert: false,
      imageUrl: imageBase64,
    };

    const storedHistory = localStorage.getItem('appHistory');
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];
    // 최신 순으로 저장
    localStorage.setItem('appHistory', JSON.stringify([newEvent, ...historyArray].slice(0, 20)));

    setTimeout(() => setIsCapturing(false), 300);
  };

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {/* 헤더 */}
      <header className="flex-none bg-white z-30 flex items-center justify-between px-6 border-b border-gray-100 shadow-sm pt-[calc(env(safe-area-inset-top)+16px)] pb-4">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          🎥 실시간 모니터링
        </h1>
        <div className="flex items-center gap-2">
          <Video size={22} className={isStreaming ? 'text-red-500 animate-pulse' : 'text-gray-400'} />
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-y-auto p-6 pb-[calc(100px+env(safe-area-inset-bottom))] overscroll-y-contain -webkit-overflow-scrolling-touch">
        <div className="space-y-6">
          
          {/* ✅ 카메라 카드 */}
          <div className="bg-black w-full rounded-3xl overflow-hidden border border-gray-200 shadow-lg relative group">
            
            {/* 📸 찰칵 효과 */}
            {isCapturing && (
              <div className="absolute inset-0 z-50 bg-white animate-[ping_0.1s_ease-out_1]"></div>
            )}

            {/* 4:3 비율 컨테이너 */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-black">
              
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-2 z-10 shadow-sm">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>

              {!isStreaming ? (
                <div className="text-gray-300 text-sm">스트리밍 대기 중</div>
              ) : isMobile ? (
                <img
                  src={imgSrc}
                  alt="실시간 프레임"
                  className="w-full h-full object-contain"
                  onError={() => setTimeout(() => setNonce(Date.now()), 500)}
                />
              ) : (
                <iframe
                  key={mounted ? nonce : 0}
                  src={iframeSrc}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  suppressHydrationWarning
                  style={{ objectFit: 'contain' }}
                />
              )}

              {/* 🟢 일시정지 버튼 */}
              {isMobile && isStreaming && (
                <button
                  onClick={() => setPlaying((v) => !v)}
                  className="absolute bottom-3 right-3 z-20 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1 transition-all active:scale-95"
                  type="button"
                >
                  {playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                  {playing ? '일시정지' : '재생'}
                </button>
              )}
            </div>
          </div>

          {/* ✅ 스트리밍 제어 버튼 */}
          <button
            onClick={toggleStream}
            className={`w-full py-4 rounded-3xl font-extrabold text-lg shadow-lg active:scale-[0.99] transition ${
              isStreaming
                ? 'bg-white text-red-600 border-2 border-red-100 hover:bg-red-50'
                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
            }`}
          >
            {isStreaming ? '🛑 스트리밍 종료' : '▶️ 스트리밍 시작'}
          </button>

          {/* ✅ 스냅샷 영역 */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-[20px] font-bold text-gray-900 mb-4">
              <Camera size={24} />
              스냅샷
            </div>

            <button
              onClick={handleCaptureSnapshot}
              disabled={!isStreaming}
              className={`w-full py-4 rounded-3xl font-extrabold text-lg shadow-md active:scale-[0.99] transition ${
                isStreaming ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              📸 화면 캡쳐
            </button>

            {/* 캡쳐 미리보기 */}
            {snapshotUrl && (
              <div className="mt-6 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-700">방금 찍은 사진</span>
                  <span className="text-xs text-gray-400">기록 탭에 저장됨</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-black">
                  <img src={snapshotUrl} alt="캡처된 이미지" className="w-full h-auto object-contain" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}