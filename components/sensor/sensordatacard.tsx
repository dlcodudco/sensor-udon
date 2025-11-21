// components/sensor/sensordatacard.tsx

interface SensorDataCardProps {
  title: string;
  value: string | number;
  status: '정상' | '경고' | '위험';
  unit: string;
}

const statusStyles = {
  정상: 'bg-green-100 text-green-700',
  경고: 'bg-yellow-100 text-yellow-700',
  위험: 'bg-red-100 text-red-700',
};

export default function SensorDataCard({ title, value, status, unit }: SensorDataCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <div className="flex items-baseline mb-3">
        {/* ⭐ 데이터 값 크게 표시 */}
        <span className="text-3xl font-extrabold text-gray-900 leading-none">
          {value}
        </span>
        <span className="ml-1 text-base font-semibold text-gray-600">
          {unit}
        </span>
      </div>
      
      {/* ⭐ 상태 표시 태그 */}
      <span 
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}
      >
        {status}
      </span>
    </div>
  );
}