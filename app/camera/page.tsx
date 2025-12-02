/*export default function CameraPage() {
  return (
    <div>
      <h1>카메라 화면</h1>
      <img src="" alt="camera stream" />
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import { Video, Camera } from 'lucide-react';

// 백엔드 스트리밍 주소 (팀원에게 받은 주소)
const STREAM_URL = "https://sensorudon-backend.onrender.com/camera";

interface HistoryEvent {
  id: number;
  timestamp: string;
  eventType: '충격' | '기울기' | '수동캡처' | '배송시작' | '배송완료';
  eventValue: number;
  message: string;
  isAlert: boolean;
  imageUrl?: string;
}

export default function CameraScreen() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  // 스트리밍 갱신용 키 (껐다 켤 때 영상 새로고침 위함)
  const [streamKey, setStreamKey] = useState(Date.now());

  useEffect(() => {
    const savedStreamState = localStorage.getItem('isStreaming');
    if (savedStreamState === 'true') {
      setIsStreaming(true);
    }
  }, []);
  
  const handleToggleStream = () => {
    const newState = !isStreaming;
    setIsStreaming(newState);
    
    // 스트리밍을 켤 때마다 키를 갱신해서 이미지를 새로 불러옴
    if (newState) {
      setStreamKey(Date.now());
      setSnapshotUrl(null);
    }

    localStorage.setItem('isStreaming', newState.toString());
  };

  const handleCaptureSnapshot = () => {
    const timestamp = new Date().toISOString();
    
    // 캡처 시 현재 스트리밍 화면을 이미지로 저장 (URL 뒤에 시간 붙여서 고정)
    // 주의: 실제 이미지 데이터가 아닌 URL을 저장하는 방식입니다.
    const currentCaptureUrl = `${STREAM_URL}?t=${Date.now()}`;
    
    setSnapshotUrl(currentCaptureUrl); 

    const newEvent: HistoryEvent = {
      id: Date.now(),
      timestamp: timestamp,
      eventType: '수동캡처',
      eventValue: 0,
      message: '사용자가 카메라 화면에서 직접 캡처했습니다.',
      isAlert: false,
      imageUrl: currentCaptureUrl,
    };

    const storedHistory = localStorage.getItem('appHistory');
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];
    const updatedHistory = [newEvent, ...historyArray];
    localStorage.setItem('appHistory', JSON.stringify(updatedHistory));

    console.log("📸 수동 캡처 기록 저장 완료:", newEvent);
  };

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {/* [상단 헤더] */}
      <header className="
        flex-none bg-white z-30 
        flex items-center justify-between px-6
        border-b border-gray-100 shadow-sm
        pt-[calc(env(safe-area-inset-top)+16px)] 
        pb-4
      ">
        <h1 className="text-xl font-bold text-gray-900">🎥 실시간 모니터링</h1>
        <div className="flex gap-4 text-gray-500">
          <Video size={20} className={isStreaming ? "text-red-500 animate-pulse" : ""} />
        </div>
      </header>

      {/* [본문 콘텐츠] */}
      <main className="
        flex-1 overflow-y-auto 
        p-6 pb-[calc(100px+env(safe-area-inset-bottom))] 
        overscroll-y-contain
        -webkit-overflow-scrolling-touch
      ">
        <div className="space-y-6">
          
          {/* 1. 영상 스트리밍 영역 */}
          <div className="bg-gray-900 aspect-video w-full rounded-2xl shadow-lg overflow-hidden relative border border-gray-800">
            {/* 스트리밍 꺼짐 상태 */}
            {!isStreaming && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white p-4 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                    <Video className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-lg font-medium">스트리밍 대기 중</p>
                <p className="text-sm text-gray-400 mt-1">아래 시작 버튼을 눌러주세요</p>
              </div>
            )}
            
            {/* 스트리밍 켜짐 상태 (실제 영상) */}
            {isStreaming && (
                <div className="w-full h-full flex items-center justify-center bg-black relative">
                    {/* 라이브 배지 */}
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 z-10 shadow-sm">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                    </div>

                    {/* ⭐ 실제 CCTV 영상 (img 태그 사용) */}
                    <img 
                      src={`${STREAM_URL}?t=${streamKey}`}
                      alt="실시간 CCTV" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // 이미지 로드 실패 시 대체 텍스트 표시
                        e.currentTarget.style.display = 'none';
                        alert("카메라 연결에 실패했습니다. 백엔드 서버를 확인해주세요.");
                      }}
                    />
                </div>
            )}
          </div>

          {/* 2. 스트림 제어 버튼 */}
          <button
            onClick={handleToggleStream}
            className={`w-full py-4 font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isStreaming 
                ? 'bg-white text-red-600 border-2 border-red-100 hover:bg-red-50' 
                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
            }`}
          >
            {isStreaming ? (
                <>🛑 스트리밍 종료</>
            ) : (
                <>▶️ 스트리밍 시작</>
            )}
          </button>

          {/* 3. 스냅샷(캡처) 버튼 */}
          <div className="pt-2 border-t border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Camera size={20} />
                스냅샷
            </h2>
            
            <button
              onClick={handleCaptureSnapshot}
              disabled={!isStreaming} 
              className={`w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                isStreaming
                  ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              📸 화면 캡처
            </button>

            {/* 캡처 미리보기 */}
            {snapshotUrl && (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-800">방금 캡처된 이미지</span>
                    <span className="text-xs text-gray-400">기록 페이지에 저장됨</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-100">
                    <img 
                      src={snapshotUrl} 
                      alt="캡처된 이미지" 
                      className="w-full h-auto object-cover"
                    />
                </div>
              </div>
            )}
          </div>
          
          <div className="h-4"></div>
        </div>
      </main>
    </div>
  );
}