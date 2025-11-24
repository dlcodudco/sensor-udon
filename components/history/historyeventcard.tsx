// components/history/historyeventdard.tsx

import { AlertTriangle, Camera, Package, Thermometer, Truck, CheckCircle, Info } from 'lucide-react';

// 1. 부모 페이지(page.tsx)와 타입을 완벽하게 일치시킵니다.
interface HistoryEvent {
  id: number;
  timestamp: string;
  // 👇 여기에 '배송시작', '배송완료'가 추가되어야 빨간 줄이 사라집니다!
  eventType: '충격' | '기울기' | '수동캡처' | '온도' | '배송시작' | '배송완료';
  eventValue: number; // 이것도 추가
  message: string;
  isAlert: boolean;
  imageUrl?: string;
}

interface Props {
  event: HistoryEvent;
}

export default function HistoryEventCard({ event }: Props) {
  
  // 2. 이벤트 타입별 아이콘 및 색상 설정 (배송시작/완료 추가)
  const getEventStyle = (type: string) => {
    switch (type) {
      case '충격':
        return { icon: AlertTriangle, bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
      case '기울기':
        return { icon: Package, bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' };
      case '온도':
        return { icon: Thermometer, bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
      case '수동캡처':
        return { icon: Camera, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
      case '배송시작': // 🆕 추가됨
        return { icon: Truck, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
      case '배송완료': // 🆕 추가됨
        return { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
      default:
        return { icon: Info, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const style = getEventStyle(event.eventType);
  const Icon = style.icon;
  
  // 날짜 포맷팅 (오전/오후 HH:MM)
  const timeString = new Date(event.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex flex-col bg-white p-4 rounded-2xl border ${style.border} shadow-sm transition-all hover:shadow-md`}>
      
      {/* 상단: 아이콘 + 제목 + 시간 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* 아이콘 박스 */}
          <div className={`p-2.5 rounded-xl ${style.bg} ${style.text}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          
          {/* 제목 및 수치 */}
          <div>
            <h3 className={`text-sm font-bold ${style.text}`}>
              {event.eventType} 
              {/* 배송 관련이 아닐 때만 수치 표시 */}
              {event.eventType !== '배송시작' && event.eventType !== '배송완료' && event.eventType !== '수동캡처' && (
                 <span className="ml-1 text-xs opacity-80">
                   ({event.eventValue}{event.eventType === '온도' ? '°C' : event.eventType === '기울기' ? '°' : ''})
                 </span>
              )}
            </h3>
            <span className="text-xs text-gray-400 font-medium">{timeString}</span>
          </div>
        </div>

        {/* 경고 뱃지 */}
        {event.isAlert && (
          <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-full border border-red-100">
            경고
          </span>
        )}
      </div>

      {/* 메시지 */}
      <p className="text-sm text-gray-600 leading-relaxed ml-1">
        {event.message}
      </p>

      {/* 📸 이미지가 있으면 표시 (폴라로이드 스타일) */}
      {event.imageUrl && (
        <div className="mt-3 relative group overflow-hidden rounded-xl border border-gray-100">
          <img 
            src={event.imageUrl} 
            alt="Event Snapshot" 
            className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
                e.currentTarget.style.display = 'none'; // 이미지 로드 실패 시 숨김
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
            <p className="text-white text-xs font-medium flex items-center gap-1">
              <Camera size={12} /> 현장 스냅샷
            </p>
          </div>
        </div>
      )}
    </div>
  );
}