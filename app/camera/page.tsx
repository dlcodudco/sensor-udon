/*export default function CameraPage() {
  return (
    <div>
      <h1>카메라 화면</h1>
      <img src="" alt="camera stream" />
    </div>
  );
}*/

'use client';

import { useState } from 'react';
import { Video, Camera } from 'lucide-react'; // 아이콘 추가

export default function CameraScreen() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  
  // 1. 스트리밍 시작/종료 핸들러
  const handleToggleStream = () => {
    setIsStreaming(!isStreaming);
    if (isStreaming) {
      setSnapshotUrl(null);
    }
  };

  // 2. 스냅샷(캡처) 핸들러
  const handleCaptureSnapshot = () => {
    // 임시 더미 이미지 (실제 구현 시 API 연결 필요)
    const tempUrl = `https://placehold.co/600x400/3c3c3c/d9d9d9?text=Captured+Snapshot\n@${new Date().toLocaleTimeString()}`;
    setSnapshotUrl(tempUrl);
  };

  return (
    // 전체 컨테이너: 화면 꽉 채움 + 스크롤 방지
    <div className="flex flex-col h-[100dvh] bg-gray-50 overflow-hidden">
      
      {/* [상단 헤더] 고정 영역 */}
      <header className="
        flex-none h-16 bg-white z-10 
        flex items-center justify-between px-6
        border-b border-gray-100 shadow-sm
        pt-[env(safe-area-inset-top)]
      ">
        <h1 className="text-xl font-bold text-gray-900">🎥실시간 모니터링</h1>
        <div className="flex gap-4 text-gray-500">
           {/* 헤더 우측 아이콘 (장식용) */}
          <Video size={20} className={isStreaming ? "text-red-500 animate-pulse" : ""} />
        </div>
      </header>

      {/* [본문 콘텐츠] 스크롤 가능한 영역 */}
      <main className="
        flex-1 overflow-y-auto 
        p-6 pb-[calc(80px+env(safe-area-inset-bottom))] 
        overscroll-y-contain
      ">
        <div className="space-y-6">
          
          {/* 1. 영상 스트리밍 영역 (가로세로 비율 유지) */}
          <div className="bg-gray-900 aspect-video w-full rounded-2xl shadow-lg overflow-hidden relative border border-gray-800">
            {!isStreaming && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white p-4 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                    <Video className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-lg font-medium">스트리밍 대기 중</p>
                <p className="text-sm text-gray-400 mt-1">아래 시작 버튼을 눌러주세요</p>
              </div>
            )}
            
            {isStreaming && (
                <div className="w-full h-full flex items-center justify-center bg-black relative">
                    {/* 라이브 표시 배지 */}
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 z-10">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                    </div>

                    <div className="text-center text-gray-400">
                        <p className="text-xl font-mono text-white mb-2">📡 STREAMING...</p>
                        <p className="text-xs">실제 영상이 여기에 표시됩니다</p>
                    </div>
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

          {/* 3. 스냅샷(캡처) 버튼 및 영역 */}
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

            {/* 캡처된 이미지 미리보기 카드 */}
            {snapshotUrl && (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-800">최근 캡처</span>
                    <span className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</span>
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
          
          {/* 하단 여백 (스크롤 편의성) */}
          <div className="h-4"></div>

        </div>
      </main>
    </div>
  );
}