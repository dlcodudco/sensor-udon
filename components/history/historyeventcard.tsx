// components/history/historyeventdard.tsx

interface HistoryEvent {
  id: number;
  timestamp: string;
  eventType: '충격' | '기울기' | '온도' | '수동캡처';
  eventValue: number;
  message: string;
  isAlert: boolean;
  imageUrl?: string;
}

interface HistoryEventCardProps {
    event: HistoryEvent;
}

const typeColors = {
    충격: 'bg-red-100 text-red-700 border-red-300',
    기울기: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    온도: 'bg-orange-100 text-orange-700 border-orange-300',
    수동캡처: 'bg-blue-100 text-blue-700 border-blue-300',
};

// 시간 포맷팅 함수 (ISO 8601 시간을 HH:mm:ss 형식으로 변환)
const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};


export default function HistoryEventCard({ event }: HistoryEventCardProps) {
    const isError = event.isAlert || event.eventType === '충격' || event.eventType === '기울기' || event.eventType === '온도';
    
    return (
        <div 
            className={`bg-white p-4 rounded-xl shadow-md transition duration-300 border-l-4 ${
                isError ? 'border-red-500 hover:shadow-lg' : 'border-gray-200 hover:shadow-md'
            } flex items-start space-x-4`}
        >
            {/* 1. 시간 표시 영역 */}
            <div className="flex-shrink-0 text-right text-gray-500 text-sm mt-1">
                <p className="font-mono">{formatTime(event.timestamp)}</p>
                {event.isAlert && <span className="text-red-500 font-bold text-xs mt-0.5 block">⚠ ALERT</span>}
            </div>

            {/* 2. 이벤트 내용 */}
            <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-1">
                    {/* 이벤트 타입 태그 */}
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${typeColors[event.eventType]}`}>
                        {event.eventType}
                    </span>
                    {/* 이벤트 값 */}
                    {event.eventValue > 0 && (
                        <span className="text-sm font-bold text-gray-800">
                            {event.eventValue}{event.eventType === '온도' ? '°C' : event.eventType === '기울기' ? '°' : ''}
                        </span>
                    )}
                </div>

                {/* 메시지 */}
                <p className="text-gray-900 font-medium">{event.message}</p>

                {/* 캡처 이미지 미리보기 */}
                {event.imageUrl && (
                    <div className="mt-3">
                        <img 
                            src={event.imageUrl} 
                            alt={`${event.eventType} 캡처`} 
                            className="w-full max-w-xs h-auto rounded-lg border border-gray-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">이벤트 시점의 캡처 이미지</p>
                    </div>
                )}
            </div>
        </div>
    );
}