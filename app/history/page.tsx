/*export default function HistoryPage() {
  return (
    <div>
      <h1>기록 화면</h1>
      <p>아직 저장된 기록이 없습니다.</p>
    </div>
  );
}*/

'use client';

import { useState } from 'react';
import { FileText, BarChart2 } from 'lucide-react'; // 아이콘 추가
import HistoryEventCard from '../../components/history/historyeventcard';
import HistoryGraph from '../../components/history/historygraph';

// DB에서 가져올 이벤트 기록 데이터 구조
interface HistoryEvent {
  id: number;
  timestamp: string;
  eventType: '충격' | '기울기' | '온도' | '수동캡처';
  eventValue: number;
  message: string;
  isAlert: boolean;
  imageUrl?: string;
}

// ⭐ 임시 데이터 (Mock Data)
const MOCK_HISTORY_DATA: HistoryEvent[] = [
  { id: 5, timestamp: '2025-11-21T15:00:00Z', eventType: '충격', eventValue: 120, message: '경고: 심한 충격이 감지되었습니다!', isAlert: true, imageUrl: 'https://placehold.co/600x400/800080/ffffff?text=Auto+Capture+Impact' },
  { id: 4, timestamp: '2025-11-21T14:50:00Z', eventType: '온도', eventValue: 35.5, message: '온도 임계값(35°C) 초과 감지.', isAlert: true, imageUrl: undefined },
  { id: 3, timestamp: '2025-11-21T14:30:00Z', eventType: '수동캡처', eventValue: 0, message: '사용자가 수동 캡처를 기록했습니다.', isAlert: false, imageUrl: 'https://placehold.co/600x400/2a9d8f/ffffff?text=User+Capture' },
  { id: 2, timestamp: '2025-11-21T14:15:00Z', eventType: '기울기', eventValue: 40.1, message: '위험 기울기(40°) 장시간 지속!', isAlert: true, imageUrl: 'https://placehold.co/600x400/e9c46a/ffffff?text=Auto+Capture+Tilt' },
  { id: 1, timestamp: '2025-11-21T14:00:00Z', eventType: '온도', eventValue: 28.0, message: '배송 시작 및 모니터링 시작.', isAlert: false, imageUrl: undefined },
];

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEvent[]>(MOCK_HISTORY_DATA);
  const [isGraphVisible, setIsGraphVisible] = useState(true);

  // 🚨 실제 데이터 fetching 로직은 useEffect에서 구현
  // useEffect(() => { /* fetchHistoryData(); */ }, []);

  return (
    // 전체 컨테이너: 화면 꽉 채움 + 스크롤 방지
    <div className="flex flex-col h-[100dvh] bg-gray-50 overflow-hidden">
      
      {/* [상단 헤더] 고정 영역 */}
      <header className="
        flex-none h-16 bg-white z-10 
        flex items-center justify-between px-6
        border-b border-gray-100 shadow-sm
        pt-[calc(env(safe-area-inset-top)+16px)]
        pb-4
      ">
        <h1 className="text-xl font-bold text-gray-900">📜배송 이벤트 기록</h1>
        <div className="flex gap-4 text-gray-500">
           {/* 그래프 토글 버튼을 헤더로 이동 (공간 활용) */}
           <button 
             onClick={() => setIsGraphVisible(!isGraphVisible)}
             className={`transition p-1 rounded-full ${isGraphVisible ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600'}`}
           >
             <BarChart2 size={24} />
           </button>
        </div>
      </header>

      {/* [본문 콘텐츠] 스크롤 가능한 영역 */}
      <main className="
        flex-1 overflow-y-auto 
        p-6 pb-[calc(80px+env(safe-area-inset-bottom))] 
        overscroll-y-contain
      ">
        <div className="space-y-6">

          {/* 1. 센서 데이터 그래프 영역 */}
          {isGraphVisible && (
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 ml-1">
                    <BarChart2 size={16} />
                    <span>변화 추이</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
                    <HistoryGraph data={history} />
                </div>
            </div>
          )}

          {/* 2. 이벤트 목록 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mt-2">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <FileText size={20} className="text-gray-500" />
                시간대별 기록
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Total {history.length}
            </span>
          </div>

          {/* 3. 이벤트 카드 리스트 */}
          <div className="space-y-4">
            {history.length > 0 ? (
                history.map(event => (
                  <HistoryEventCard key={event.id} event={event} />
                ))
            ) : (
                <div className="text-center py-10 text-gray-400">
                    <p>아직 기록된 이벤트가 없습니다.</p>
                </div>
            )}
          </div>

          {/* 하단 여백 */}
          <div className="h-4"></div>
        </div>
      </main>
    </div>
  );
}