// SENSORUDON/sensor-udon/components/dashboard/DashboardScreen.tsx

'use client'; 

import { useEffect, useState } from 'react';

// 센서 데이터의 타입을 정의합니다.
interface SensorData {
  temperature: number;
  humidity: number;
  tilt: number;
}

// 초기 데이터 (데이터 로드 전 임시 값)
const initialSensorData: SensorData = {
  temperature: 0,
  humidity: 0,
  tilt: 0,
};

// 현재 app/page.tsx에 있던 Home 컴포넌트의 모든 로직을 가져옵니다.
export default function DashboardScreen() {
  const [sensor, setSensor] = useState<SensorData>(initialSensorData);
  const [loading, setLoading] = useState(true);

  // 이 부분은 데이터를 가져오는 로직입니다. (현재는 Mock Data)
  useEffect(() => {
    // 실제로는 여기에 API 호출 코드가 들어갑니다.
    const fetchData = async () => {
      // Mock Data (임시 데이터)
      const mockData: SensorData = {
        temperature: 25.5,
        humidity: 60.2,
        tilt: 3.5, // 3.5도로 가정
      };

      await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 지연 효과
      
      setSensor(mockData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      
      {/* 1. 제목 영역 */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Sensor Udon Dashboard
      </h1>
      
      {/* 2. 센서 카드 그리드 영역 (기존 page.tsx의 main 내용) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        {/* Temperature 카드 */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Temperature /°C</h2>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? 'Loading...' : `${sensor.temperature.toFixed(1)}°C`}
          </p>
        </div>

        {/* Humidity 카드 */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Humidity /%</h2>
          <p className="text-3xl font-bold text-green-600">
            {loading ? 'Loading...' : `${sensor.humidity.toFixed(1)}%`}
          </p>
        </div>

        {/* Tilt 카드 */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Tilt /°</h2>
          <p className="text-3xl font-bold text-red-600">
            {loading ? 'Loading...' : `${sensor.tilt.toFixed(1)}°`}
          </p>
        </div>

      </div>
      
      {/* 여기에 네비게이션 바 컴포넌트가 들어갈 예정입니다. */}
      {/* <Navbar /> */}

    </main>
  );
}