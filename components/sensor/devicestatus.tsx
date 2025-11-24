// components/sensor/devicestatus.tsx

interface DeviceStatusProps {
  battery: number; // 배터리 잔량 (%)
  connectionStatus: '연결됨' | '연결 끊김'; // 연결 상태
}

export default function DeviceStatus({ battery, connectionStatus }: DeviceStatusProps) {
  
  // 배터리 아이콘 선택 로직
  const getBatteryIcon = (percent: number) => {
    if (percent > 75) return '🔋';
    if (percent > 40) return ' moderately high battery level emoji'; // 🪫
    if (percent > 15) return '🪫';
    return '🚨'; // 낮은 배터리 경고
  };
  
  const statusColor = connectionStatus === '연결됨' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex justify-between items-center border border-gray-100">
      
      {/* 1. 연결 상태 */}
      <div className="flex items-center space-x-2">
        <span className={`h-3 w-3 rounded-full ${connectionStatus === '연결됨' ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <p className="text-sm text-gray-400 font-semibold">장치 연결 상태:</p>
        <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
          {connectionStatus}
        </span>
      </div>

      {/* 2. 배터리 상태 */}
      <div className="flex items-center space-x-2">
        <span className="text-xl">
          {getBatteryIcon(battery)}
        </span>
        <p className="text-sm font-semibold text-gray-700">
          배터리: {battery}%
        </p>
      </div>
    </div>
  );
}