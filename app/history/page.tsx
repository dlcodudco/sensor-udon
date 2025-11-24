/*export default function HistoryPage() {
  return (
    <div>
      <h1>기록 화면</h1>
      <p>아직 저장된 기록이 없습니다.</p>
    </div>
  );
}*/

'use client';

import { useState, useEffect } from 'react';
import { FileText, Camera, AlertTriangle, Package, Clock } from 'lucide-react'; 
import HistoryEventCard from '../../components/history/historyeventcard';

// DB에서 가져올 이벤트 기록 데이터 구조
export interface HistoryEvent {
  id: number;
  timestamp: string;
  eventType: '충격' | '기울기' | '수동캡처' | '배송시작' | '배송완료';
  eventValue: number; 
  message: string;
  isAlert: boolean;
  imageUrl?: string; 
}

// 기본 샘플 데이터 (저장된 게 없을 때 보여줄 것)
const DEFAULT_MOCK_DATA: HistoryEvent[] = [
  { id: 1, timestamp: new Date().toISOString(), eventType: '배송시작', eventValue: 0, message: '배송 모니터링 시작', isAlert: false },
];

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEvent[]>([]);

  // 화면이 켜질 때 localStorage에서 데이터 불러오기
  useEffect(() => {
    const storedHistory = localStorage.getItem('appHistory');
    
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    } else {
      setHistory(DEFAULT_MOCK_DATA);
      localStorage.setItem('appHistory', JSON.stringify(DEFAULT_MOCK_DATA));
    }
  }, []);

  // 🚨 [수정된 부분] 여기가 중복되어 있어서 에러가 났었습니다! 하나만 남겼습니다.
  // 요약 통계 계산
  const summary = {
    shock: history.filter(e => e.eventType === '충격').length,
    tilt: history.filter(e => e.eventType === '기울기').length,
    manual: history.filter(e => e.eventType === '수동캡처').length,
  };

  return (
    // 1. 최상위 컨테이너
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {/* 2. 헤더 */}
      <header className="
        flex-none bg-white z-30 
        flex items-center justify-between px-6
        border-b border-gray-100 shadow-sm
        pt-[calc(env(safe-area-inset-top)+16px)] 
        pb-4
      ">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock size={22} /> 배송 타임라인
        </h1>
      </header>

      {/* 3. 본문 */}
      <main className="
        flex-1 overflow-y-auto 
        p-6 pb-[calc(100px+env(safe-area-inset-bottom))] 
        overscroll-y-contain
        -webkit-overflow-scrolling-touch
      ">
        <div className="space-y-6">

          {/* 1. 요약 대시보드 */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-1">
              <FileText size={16} /> 오늘의 주요 기록
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {/* 충격 요약 */}
              <div className="flex flex-col items-center p-3 bg-red-50 rounded-2xl border border-red-100">
                <AlertTriangle className="text-red-500 mb-1" size={24} />
                <span className="text-xs text-gray-500 font-medium">충격 감지</span>
                <span className="text-xl font-extrabold text-red-600">{summary.shock}건</span>
              </div>
              {/* 기울기 요약 */}
              <div className="flex flex-col items-center p-3 bg-orange-50 rounded-2xl border border-orange-100">
                <Package className="text-orange-500 mb-1" size={24} />
                <span className="text-xs text-gray-500 font-medium">기울기 알림</span>
                <span className="text-xl font-extrabold text-orange-600">{summary.tilt}건</span>
              </div>
              {/* 수동 캡처 요약 */}
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <Camera className="text-blue-500 mb-1" size={24} />
                <span className="text-xs text-gray-500 font-medium">수동 캡처</span>
                <span className="text-xl font-extrabold text-blue-600">{summary.manual}건</span>
              </div>
            </div>
          </div>

          {/* 2. 타임라인 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mt-4">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Clock size={20} className="text-gray-500" />
                상세 타임라인
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                총 {history.length}개의 이벤트
            </span>
          </div>

          {/* 3. 이벤트 리스트 */}
          <div className="space-y-4 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200 z-0"></div>
            
            {history.length > 0 ? (
                history.map((event) => (
                  <div key={event.id} className="relative z-10">
                    <HistoryEventCard event={event} />
                  </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
                    <p>아직 기록된 이벤트가 없습니다.</p>
                </div>
            )}
          </div>

          <div className="h-4"></div>
        </div>
      </main>
    </div>
  );
}