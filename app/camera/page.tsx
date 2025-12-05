'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, ExternalLink, Video, Camera } from 'lucide-react';

// PC에서 볼(원하면) 백엔드 라이브 페이지
const LIVE_PAGE = 'https://sensorudon-backend.onrender.com/camera/live';

// 폰에서 확실히 뜨는 최신 프레임(정답)
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

export default function CameraPage() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [nonce, setNonce] = useState(0);
  const [playing, setPlaying] = useState(true);

  // 스트리밍 on/off (버튼 유지)
  const [isStreaming, setIsStreaming] = useState(false);

  // 캡쳐 미리보기
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

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

  // 모바일: latest.jpg 를 300ms 갱신(스트리밍 켜져있고 playing일 때만)
  useEffect(() => {
    if (!mounted) return;
    if (!isMobile) return;
    if (!isStreaming) return;
    if (!playing) return;

    const id = setInterval(() => setNonce(Date.now()), 300);
    return () => clearInterval(id);
  }, [mounted, isMobile, isStreaming, playing]);

  const iframeSrc = useMemo(() => {
    if (!mounted) return LIVE_PAGE;
    const sep = LIVE_PAGE.includes('?') ? '&' : '?';
    return `${LIVE_PAGE}${sep}t=${nonce}`;
  }, [mounted, nonce]);

  const imgSrc = useMemo(() => {
    if (!mounted) return LATEST_JPG;
    const sep = LATEST_JPG.includes('?') ? '&' : '?';
    return `${LATEST_JPG}${sep}t=${nonce}`;
  }, [mounted, nonce]);

  const reconnect = () => setNonce(Date.now());
  const openNewTab = () => window.open(LIVE_PAGE, '_blank', 'noopener,noreferrer');

  const toggleStream = () => {
    const next = !isStreaming;
    setIsStreaming(next);
    localStorage.setItem('isStreaming', next.toString());
    setSnapshotUrl(null);

    if (next) setNonce(Date.now()); // 켤 때 즉시 새로고침
  };

  // ✅ 캡쳐: “live 페이지”가 아니라 “latest.jpg”를 저장해야 안정적임
  const handleCaptureSnapshot = () => {
    if (!isStreaming) return;

    const timestamp = new Date().toISOString();

    // 캡쳐 순간의 최신 프레임을 고정 URL로 저장
    const currentCaptureUrl = `${LATEST_JPG}${LATEST_JPG.includes('?') ? '&' : '?'}t=${Date.now()}`;
    setSnapshotUrl(currentCaptureUrl);

    const newEvent: HistoryEvent = {
      id: Date.now(),
      timestamp,
      eventType: '수동캡처',
      eventValue: 0,
      message: '사용자가 카메라 화면에서 직접 캡처했습니다.',
      isAlert: false,
      imageUrl: currentCaptureUrl,
    };

    const storedHistory = localStorage.getItem('appHistory');
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];
    localStorage.setItem('appHistory', JSON.stringify([newEvent, ...historyArray]));
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm pt-[calc(env(safe-area-inset-top)+12px)] pb-3">
        <div className="px-5 flex items-center justify-between">
          <h1 className="text-[22px] font-extrabold text-gray-900 flex items-center gap-2">
            🎥 실시간 모니터링
          </h1>

          <div className="flex items-center gap-2">
            <Video size={22} className={isStreaming ? 'text-red-500 animate-pulse' : 'text-gray-400'} />

            <button
              onClick={reconnect}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm flex items-center gap-2"
              type="button"
            >
              <RefreshCw size={16} />
              재연결
            </button>

            <button
              onClick={openNewTab}
              className="px-3 py-2 rounded-xl bg-black text-white hover:bg-gray-800 text-sm flex items-center gap-2"
              type="button"
            >
              <ExternalLink size={16} />
              새 탭
            </button>
          </div>
        </div>
      </header>

      <main className="px-5 pb-[calc(88px+env(safe-area-inset-bottom))] pt-5">
        <div className="space-y-5">
          {/* ✅ 카메라 카드 (모바일 비율 맞춤) */}
          <div className="bg-black w-full rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
            <div className="relative w-full aspect-[16/9] flex items-center justify-center">
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
                />
              )}
            </div>
          </div>

          {/* ✅ 스트리밍 시작/종료 버튼 */}
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

          {/* ✅ 스냅샷 영역 (멘트 제거, 버튼 유지) */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-[24px] font-extrabold text-gray-900">
              <Camera size={24} />
              스냅샷
            </div>

            <button
              onClick={handleCaptureSnapshot}
              disabled={!isStreaming}
              className={`mt-4 w-full py-4 rounded-3xl font-extrabold text-lg shadow-md active:scale-[0.99] transition ${
                isStreaming ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              📸 화면 캡쳐
            </button>

            {isMobile && isStreaming && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setPlaying((v) => !v)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm"
                  type="button"
                >
                  {playing ? '⏸️ 일시정지' : '▶️ 재생'}
                </button>
              </div>
            )}

            {/* 캡쳐 미리보기 */}
            {snapshotUrl && (
              <div className="mt-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  <img src={snapshotUrl} alt="캡처된 이미지" className="w-full h-auto object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
