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

export default function CameraScreen() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  
  // 🚨 1. 스트리밍 시작/종료 함수 (추후 실제 스트리밍 연결 필요)
  const handleToggleStream = () => {
    // 실제 백엔드에 스트리밍 시작/종료 요청을 보내는 로직이 여기에 들어갑니다.
    setIsStreaming(!isStreaming);
    if (isStreaming) {
      setSnapshotUrl(null); // 스트리밍 종료 시 캡처 초기화
    }
  };

  // 🚨 2. 스냅샷(캡처) 함수 (추후 실제 API 연결 필요)
  const handleCaptureSnapshot = () => {
    // 실제 백엔드/장치에 캡처 요청을 보내고, 이미지 URL을 받는 로직이 들어갑니다.
    
    // ⭐ 현재는 임시 이미지 URL을 사용합니다.
    const tempUrl = `https://placehold.co/600x400/3c3c3c/d9d9d9?text=Captured+Snapshot\n@${new Date().toLocaleTimeString()}`;
    setSnapshotUrl(tempUrl);
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        🎥 실시간 내부 영상 모니터링
      </h1>

      {/* 1. 영상 스트리밍 영역 */}
      <div className="bg-gray-900 aspect-video w-full rounded-xl shadow-2xl overflow-hidden relative">
        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 text-white">
            <svg className="w-12 h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-lg font-medium">스트리밍이 중지되었습니다.</p>
            <p className="text-sm text-gray-400">시작 버튼을 눌러 영상을 확인하세요.</p>
          </div>
        )}
        
        {isStreaming && (
            // ⭐ 실제 영상 스트리밍은 <img> 태그나 <video> 태그를 사용하여
            // M-JPEG 또는 WebRTC 스트림 주소를 여기에 연결해야 합니다.
            // <img src="[스트리밍 주소]" alt="실시간 영상" className="w-full h-full object-cover" />
            <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-white text-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse inline-block mr-2"></div>
                    <p className="text-xl font-mono">LIVE STREAMING...</p>
                    <p className="text-sm text-gray-400 mt-1">실제 영상 스트림이 여기에 표시됩니다.</p>
                </div>
            </div>
        )}
      </div>

      {/* 2. 스트림 제어 버튼 */}
      <button
        onClick={handleToggleStream}
        className={`w-full py-3 font-semibold rounded-lg shadow-md transition duration-300 ${
          isStreaming 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isStreaming ? '🛑 스트리밍 종료' : '▶️ 스트리밍 시작'}
      </button>

      {/* 3. 스냅샷(캡처) 버튼 및 영역 */}
      <div className="pt-4 border-t border-gray-200 space-y-4">
        <button
          onClick={handleCaptureSnapshot}
          disabled={!isStreaming} // 스트리밍 중일 때만 활성화
          className={`w-full py-3 font-semibold rounded-lg transition duration-300 ${
            isStreaming
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          📸 현재 화면 캡처 (스냅샷)
        </button>

        {/* 캡처된 이미지 미리보기 */}
        {snapshotUrl && (
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">최근 캡처 이미지</h2>
            <img 
              src={snapshotUrl} 
              alt="캡처된 이미지" 
              className="w-full h-auto rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src="https://placehold.co/600x400/f87171/ffffff?text=Image+Load+Failed";
              }}
            />
            <p className="text-sm text-gray-500 mt-2 text-right">캡처 시간: {new Date().toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}