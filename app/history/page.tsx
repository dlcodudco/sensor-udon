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
import HistoryEventCard from '../../components/history/historyeventcard'; // 새로 만들 컴포넌트
import HistoryGraph from '../../components/history/historygraph'; // 그래프 컴포넌트

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

// ⭐ 임시 데이터: 다양한 이벤트 상황을 보여주기 위한 Mock Data
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

  // 🚨 실제로는 DB에서 기록 데이터를 가져오는 로직 (fetchHistoryData)이 여기에 들어갑니다.
  // useEffect(() => { /* fetchHistoryData(); */ }, []);


  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        📜 배송 이벤트 기록
      </h1>
      
      {/* 1. 그래프 보기/숨기기 토글 */}
      <button
        onClick={() => setIsGraphVisible(!isGraphVisible)}
        className="text-blue-600 font-medium hover:text-blue-800 transition duration-200"
      >
        {isGraphVisible ? '📊 그래프 숨기기' : '📈 그래프 보기'}
      </button>

      {/* 2. 센서 데이터 그래프 (추후 구현) */}
      {isGraphVisible && (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 h-64 flex items-center justify-center">
          <HistoryGraph data={history} />
        </div>
      )}

      {/* 3. 이벤트 목록 (알림 내용과 연동되는 부분) */}
      <h2 className="text-xl font-semibold text-gray-800 pt-2 border-t border-gray-200">
        시간대별 이벤트
      </h2>
      <div className="space-y-4">
        {history.map(event => (
          <HistoryEventCard key={event.id} event={event} />
        ))}
      </div>

    </div>
  );
}