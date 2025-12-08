'use client';

import { useState } from 'react'; // [추가] 상태 관리를 위해 필요
import { 
  AlertTriangle, Camera, Package, Thermometer, Truck, CheckCircle, Info, FileText, 
  Edit2, Save, X // [추가] 아이콘 추가
} from 'lucide-react';

interface HistoryEvent {
  id: number;
  timestamp: string;
  eventType: '충격' | '기울기' | '수동캡처' | '온도' | '배송시작' | '배송완료';
  eventValue: number;
  message: string;
  isAlert: boolean;
  imageUrl?: string;
  note?: string; 
}

interface Props {
  event: HistoryEvent;
  // [추가] 부모 컴포넌트에서 메모 저장 함수를 받아옴
  onSaveNote: (id: number, content: string) => void;
}

export default function HistoryEventCard({ event, onSaveNote }: Props) {
  // [추가] 수정 모드 및 입력 텍스트 관리
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(event.note || '');

  // 저장 버튼 클릭 시 실행
  const handleSave = () => {
    onSaveNote(event.id, noteText);
    setIsEditing(false);
  };

  // 취소 버튼 클릭 시 실행 (원래대로 복구)
  const handleCancel = () => {
    setNoteText(event.note || '');
    setIsEditing(false);
  };

  // 이벤트 타입별 스타일 설정
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
      case '배송시작':
        return { icon: Truck, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
      case '배송완료':
        return { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
      default:
        return { icon: Info, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const style = getEventStyle(event.eventType);
  const Icon = style.icon;
  
  const timeString = new Date(event.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex flex-col bg-white p-4 rounded-2xl border ${style.border} shadow-sm transition-all hover:shadow-md mb-3`}>
      
      {/* 1. 상단 정보 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${style.bg} ${style.text}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${style.text}`}>
              {event.eventType} 
              {['충격', '기울기', '온도'].includes(event.eventType) && (
                 <span className="ml-1 text-xs opacity-80">
                   ({event.eventValue}{event.eventType === '온도' ? '°C' : '°'})
                 </span>
              )}
            </h3>
            <span className="text-xs text-gray-400 font-medium">{timeString}</span>
          </div>
        </div>

        {event.isAlert && (
          <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-full border border-red-100">
            경고
          </span>
        )}
      </div>

      {/* 2. 메시지 */}
      <p className="text-sm text-gray-600 leading-relaxed ml-1 mb-2 font-medium">
        {event.message}
      </p>

      {/* 3. 📸 이미지 영역 */}
      {event.imageUrl && (
        <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 bg-black relative">
           <div className="relative w-full aspect-[4/3] flex items-center justify-center">
             <img 
               src={event.imageUrl} 
               alt="Event Snapshot" 
               className="w-full h-full object-contain"
               onError={(e) => {
                   e.currentTarget.style.display = 'none';
               }}
             />
           </div>
           <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-md border border-white/10">
             <Camera size={10} /> 현장 스냅샷
           </div>
        </div>
      )}

      {/* 4. 📝 메모 영역 (수정됨) */}
      <div className="mt-3">
        {isEditing ? (
          // [수정 모드] 입력창 + 저장/취소 버튼
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 animate-in fade-in duration-200">
            <textarea
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 resize-none"
              rows={2}
              placeholder="메모를 입력하세요..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <X size={12} /> 취소
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm"
              >
                <Save size={12} /> 저장
              </button>
            </div>
          </div>
        ) : (
          // [보기 모드] 메모 표시 or 추가 버튼
          <>
            {event.note ? (
              <div className="group relative bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-2 hover:border-blue-200 transition-colors">
                <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-xs font-bold text-gray-500 block mb-0.5">메모</span>
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{event.note}</p>
                </div>
                {/* 수정 버튼 (Hover 시 더 잘 보이게) */}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            ) : (
              // 메모가 없을 때 추가 버튼
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-2 text-xs font-medium text-gray-400 border border-dashed border-gray-300 rounded-xl hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-1"
              >
                <Edit2 size={12} /> 메모 추가하기
              </button>
            )}
          </>
        )}
      </div>

    </div>
  );
}