/*export default function HistoryPage() {
  return (
    <div>
      <h1>기록 화면</h1>
      <p>아직 저장된 기록이 없습니다.</p>
    </div>
  );
}*/

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { FileText, Camera, AlertTriangle, Package, Clock, Calendar } from 'lucide-react'; 
import HistoryEventCard from '../../components/history/historyeventcard';

export interface HistoryEvent {
  id: number;
  timestamp: string;
  eventType: '충격' | '기울기' | '수동캡처' | '온도' | '배송시작' | '배송완료';
  eventValue: number; 
  message: string;
  isAlert: boolean;
  imageUrl?: string; 
  note?: string;
}

// [중요] 한국 시간(로컬 시간)을 유지한 채 ISO 문자열을 만드는 함수
// 기존 new Date().toISOString()은 UTC(영국시간) 기준이라 9시간 전으로 잡히는 문제를 해결합니다.
export const getLocalISOString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // 분 단위를 밀리초로 변환
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().slice(0, -1); // 뒤에 'Z'를 제거
};

// 오늘 날짜 구하기 (YYYY-MM-DD, 로컬 시간 기준)
const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// [수정] Mock 데이터도 로컬 시간 함수 사용
const DEFAULT_MOCK_DATA: HistoryEvent[] = [
  { 
    id: 1, 
    timestamp: getLocalISOString(), // <-- 여기 수정됨
    eventType: '배송시작', 
    eventValue: 0, 
    message: '배송 모니터링 시작', 
    isAlert: false 
  },
];

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString()); // 기본값: 오늘

  // 스크롤 제어를 위한 Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayTabRef = useRef<HTMLButtonElement>(null);

  // 1. 데이터 로드
  useEffect(() => {
    const storedHistory = localStorage.getItem('appHistory');
    let loadedData = DEFAULT_MOCK_DATA;

    if (storedHistory) {
      loadedData = JSON.parse(storedHistory);
    } else {
      localStorage.setItem('appHistory', JSON.stringify(DEFAULT_MOCK_DATA));
    }
    setHistory(loadedData);
  }, []);

  // 2. 타임라인 날짜 목록 생성 (과거 기록 ~ 미래 15일)
  const fullDateList = useMemo(() => {
    const today = getTodayString();
    
    // (1) 기록된 가장 오래된 날짜 찾기
    const historyDates = history
      .filter(h => h && h.timestamp)
      .map(h => h.timestamp.split('T')[0]);
    
    // 기록이 하나도 없으면 오늘을 기준으로 함
    let minDateStr = historyDates.length > 0 ? historyDates.sort()[0] : today;

    // 만약 기록된 날짜가 오늘보다 미래라면(혹시 모를 오류), 오늘부터 시작
    if (minDateStr > today) minDateStr = today;

    // (2) 날짜 배열 생성 (minDate ~ today + 15일)
    const dateArray: string[] = [];
    const startDate = new Date(minDateStr);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 15); // 미래 15일 추가

    const curr = new Date(startDate);
    
    while (curr <= endDate) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      dateArray.push(`${year}-${month}-${day}`);
      
      curr.setDate(curr.getDate() + 1);
    }

    return dateArray;
  }, [history]);

  // 3. 초기 로드 시 '오늘 날짜'를 가운데로 스크롤
  useEffect(() => {
    if (todayTabRef.current) {
      todayTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center' // 가로 스크롤 중앙 정렬
      });
    }
  }, [fullDateList]); 

  // 필터링
  const filteredHistory = useMemo(() => {
    if (!selectedDate) return [];
    return history.filter(item => 
        item && 
        item.timestamp && 
        item.timestamp.startsWith(selectedDate)
    );
  }, [history, selectedDate]);

  // 요약 통계
  const summary = {
    shock: filteredHistory.filter(e => e.eventType === '충격').length,
    tilt: filteredHistory.filter(e => e.eventType === '기울기').length,
    manual: filteredHistory.filter(e => e.eventType === '수동캡처').length,
  };

  const handleSaveNote = (id: number, newNote: string) => {
    const updatedHistory = history.map((event) => 
      event.id === id ? { ...event, note: newNote } : event
    );
    setHistory(updatedHistory);
    localStorage.setItem('appHistory', JSON.stringify(updatedHistory));
  };

  // 날짜 라벨 포맷
  const formatDateLabel = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d); 
    const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${m}.${d} (${dayName})`;
  };

  // 오늘 날짜인지 확인
  const isToday = (dateStr: string) => dateStr === getTodayString();

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {/* 헤더 */}
      <header className="
        flex-none bg-white z-30 
        border-b border-gray-100 shadow-sm
        pt-[calc(env(safe-area-inset-top)+16px)] 
      ">
        <div className="px-6 pb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock size={22} /> 배송 타임라인
            </h1>
        </div>

        {/* 날짜 선택 탭 */}
        <div ref={scrollContainerRef} className="flex overflow-x-auto px-4 pb-0 scrollbar-hide gap-2 bg-white w-full border-t border-gray-50">
            {fullDateList.map((date) => {
                const today = isToday(date);
                const selected = selectedDate === date;

                return (
                <button
                    key={date}
                    ref={today ? todayTabRef : null} 
                    onClick={() => setSelectedDate(date)}
                    className={`
                        flex-none px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap
                        ${selected 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-400 hover:text-gray-600'}
                        ${today && !selected ? 'text-blue-400' : ''} 
                    `}
                >
                    {formatDateLabel(date)}
                    {today && <span className="ml-1 text-[10px] align-top text-red-500">●</span>}
                </button>
                );
            })}
        </div>
      </header>

      {/* 본문 */}
      <main className="
        flex-1 overflow-y-auto 
        p-6 pb-[calc(100px+env(safe-area-inset-bottom))] 
        overscroll-y-contain
        -webkit-overflow-scrolling-touch
      ">
        <div className="space-y-6">

          {/* 요약 대시보드 */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-500 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1">
                 <FileText size={16} /> 
                 {selectedDate ? `${formatDateLabel(selectedDate)} 기록` : '주요 기록'}
              </span>
              <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  총 {filteredHistory.length}건
              </span>
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center p-3 bg-red-50 rounded-2xl border border-red-100">
                <AlertTriangle className="text-red-500 mb-1" size={24} />
                <span className="text-xs text-gray-500 font-medium">충격</span>
                <span className="text-xl font-extrabold text-red-600">{summary.shock}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-orange-50 rounded-2xl border border-orange-100">
                <Package className="text-orange-500 mb-1" size={24} />
                <span className="text-xs text-gray-500 font-medium">기울기</span>
                <span className="text-xl font-extrabold text-orange-600">{summary.tilt}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <Camera className="text-blue-500 mb-1" size={24} />
                <span className="text-xs text-gray-500 font-medium">수동</span>
                <span className="text-xl font-extrabold text-blue-600">{summary.manual}</span>
              </div>
            </div>
          </div>

          {/* 타임라인 리스트 */}
          <div className="space-y-4 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200 z-0"></div>
            
            {filteredHistory.length > 0 ? (
                filteredHistory.map((event) => (
                  <div key={event.id} className="relative z-10">
                    <HistoryEventCard 
                      event={event} 
                      onSaveNote={handleSaveNote} 
                    />
                  </div>
                ))
            ) : (
                <div className="text-center py-20 text-gray-400">
                    <Calendar size={40} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">
                        {isToday(selectedDate) 
                            ? "오늘 아직 기록된 이벤트가 없습니다." 
                            : new Date(selectedDate) > new Date(getTodayString())
                                ? "미래의 날짜입니다."
                                : "이 날짜엔 기록이 없습니다."}
                    </p>
                </div>
            )}
          </div>

          <div className="h-4">
            
          </div>
        </div>
      </main>
    </div>
  );
}