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
import { Video, Camera } from 'lucide-react'; // 아이콘 추가

// 기록 페이지와 데이터 형식을 맞추기 위한 인터페이스 정의
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
  // 1. 초기값을 localStorage에서 가져와서 설정 (새로고침해도 유지됨)
  const [isStreaming, setIsStreaming] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  // 컴포넌트 마운트 시 저장된 스트리밍 상태 확인
  useEffect(() => {
    const savedStreamState = localStorage.getItem('isStreaming');
    if (savedStreamState === 'true') {
      setIsStreaming(true);
    }
  }, []);
  
  // 2. 스트리밍 토글 함수 (상태 저장 기능 추가)
  const handleToggleStream = () => {
    const newState = !isStreaming;
    setIsStreaming(newState);
    
    // 상태를 localStorage에 저장 (다른 페이지 갔다 와도 기억함)
    localStorage.setItem('isStreaming', newState.toString());

    if (newState) {
      setSnapshotUrl(null); // 스트리밍 켜면 기존 캡처 미리보기는 닫기
    }
  };

  // 3. 스냅샷 캡처 및 "기록 페이지로 전송" 함수
  const handleCaptureSnapshot = () => {
    const timestamp = new Date().toISOString();
    // 임시 이미지 URL 생성
    const tempUrl = `https://placehold.co/600x400/3b82f6/ffffff?text=Manual+Capture\n@${new Date().toLocaleTimeString()}`;
    
    setSnapshotUrl(tempUrl); // 현재 화면에 미리보기 표시

    // --- ⭐ 여기부터 기록 저장 로직 ---
    const newEvent: HistoryEvent = {
      id: Date.now(),
      timestamp: timestamp,
      eventType: '수동캡처',
      eventValue: 0, // 수동 캡처는 수치가 없으므로 0
      message: '사용자가 카메라 화면에서 직접 캡처했습니다.',
      isAlert: false,
      imageUrl: tempUrl,
    };

    // 기존 기록 불러오기
    const storedHistory = localStorage.getItem('appHistory');
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    // 새 기록 추가 및 저장
    const updatedHistory = [newEvent, ...historyArray];
    localStorage.setItem('appHistory', JSON.stringify(updatedHistory));

    console.log("📸 수동 캡처 기록 저장 완료:", newEvent);
  };

  return (
    // 전체 컨테이너: 화면 꽉 채움 + 스크롤 방지
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {/* [상단 헤더] 고정 영역 */}
      <header className="
        flex-none bg-white z-30 
        flex items-center justify-between px-6
        border-b border-gray-100 shadow-sm
        pt-[calc(env(safe-area-inset-top)+16px)] 
        pb-4
      ">
        <h1 className="text-xl font-bold text-gray-900">🎥 실시간 모니터링</h1>
        <div className="flex gap-4 text-gray-500">
           {/* 헤더 우측 아이콘 (스트리밍 중일 때만 깜빡임) */}
          <Video size={20} className={isStreaming ? "text-red-500 animate-pulse" : ""} />
        </div>
      </header>

      {/* [본문 콘텐츠] 스크롤 가능한 영역 */}
      <main className="
        flex-1 overflow-y-auto 
        p-6 pb-[calc(100px+env(safe-area-inset-bottom))] 
        overscroll-y-contain
        -webkit-overflow-scrolling-touch
      ">
        <div className="space-y-6">
          
          {/* 1. 영상 스트리밍 영역 */}
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
          
          {/* 하단 여백 (스크롤 편의성) */}
          <div className="h-4"></div>

        </div>
      </main>
    </div>
  );
}