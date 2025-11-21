'use client';
/*export default function SensorPage() {
  return (
    <div>
      <h1>센서 화면</h1>
      <p>기울기: --</p>
      <p>온도: --</p>
      <p>습도: --</p>
    </div>
  );
}*/

// app/sensor/page.tsx (또는 components/screens/SensorScreen.tsx)

/*'use client';

import { useEffect, useContext } from 'react';
import { HideNavContext } from '../../app/clientlayout'; // clientlayout 경로에 맞게 수정
import SensorDataCard from '../../components/sensor/sensordatacard';
import DeviceStatus from '../../components/sensor/devicestatus';
//import HistoryGraph from '../../components/sensor/HistoryGraph';

// 임시 데이터 인터페이스 (백엔드에서 가져올 데이터)
interface SensorData {
  tiltX: number; // 기울기 X축
  tiltY: number; // 기울기 Y축
  temperature: number; // 온도 (°C)
  vibration: '정상' | '감지됨'; // 진동 상태
  battery: number; // 배터리 (%)
}

const DUMMY_DATA: SensorData = {
  tiltX: 2.5,
  tiltY: -1.8,
  temperature: 24.1,
  vibration: '정상',
  battery: 85,
};

export default function SensorScreen() {
  // 로그인 화면과 마찬가지로, 내비게이션 바가 보이는 화면이므로 Context 사용 로직을 제거하거나, 
  // 만약을 위해 명시적으로 false로 설정해둘 수 있습니다. (현재 clientlayout 로직에 따라 생략 가능)
  // const { setHideNav } = useContext(HideNavContext);
  // useEffect(() => {
  //   setHideNav(false);
  //   return () => setHideNav(true); 
  // }, []);

  // 🚨 2단계에서 실제 데이터를 가져오는 로직을 추가할 예정입니다.
  const sensorData: SensorData = DUMMY_DATA; 

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        📦 배송 장치 대시보드
      </h1>
      
      {/* 1. 장치 상태 요약 (상단) */
/*      <DeviceStatus battery={sensorData.battery} connectionStatus="연결됨" />

      {/* 2. 핵심 센서 데이터 그리드 */
/*      <div className="grid grid-cols-2 gap-4">
        <SensorDataCard 
          title="기울기 (X축)" 
          value={`${sensorData.tiltX}°`} 
          status={Math.abs(sensorData.tiltX) > 5 ? '경고' : '정상'}
          unit="도"
        />
        <SensorDataCard 
          title="기울기 (Y축)" 
          value={`${sensorData.tiltY}°`} 
          status={Math.abs(sensorData.tiltY) > 5 ? '경고' : '정상'}
          unit="도"
        />
        <SensorDataCard 
          title="온도" 
          value={`${sensorData.temperature}`} 
          status={sensorData.temperature > 30 ? '경고' : '정상'}
          unit="°C"
        />
        <SensorDataCard 
          title="진동" 
          value={sensorData.vibration} 
          status={sensorData.vibration === '감지됨' ? '경고' : '정상'}
          unit=""
        />
      </div>

      {/* 3. 최근 기록 차트 (선택 사항) */
      {/* 실제 차트 라이브러리 (Recharts, Chart.js 등)를 사용하여 구현 */}
/*      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-2">최근 1시간 온도 변화</h2>
        <p className="text-gray-500 text-sm">여기에 온도 변화 그래프가 표시됩니다.</p>
        {/* <HistoryGraph dataType="온도" /> */
/*      </div>
      
    </div>
  );
}*/



import { useState, useEffect } from 'react';
import SensorDataCard from '../../components/sensor/sensordatacard'; // 파일명 수정 적용
import DeviceStatus from '../../components/sensor/devicestatus';     // 파일명 수정 적용
import { fetchLiveSensorData, LiveSensorDataResponse } from '../../utils/api'; // API import

// 로컬에서 UI에 사용할 데이터 구조 정의 (백엔드 데이터 가공용)
interface DisplaySensorData {
  tiltX: number; 
  tiltY: number; 
  temperature: number; 
  humidity: number;
  vibration: '정상' | '감지됨'; // 이 값은 백엔드에서 진동 데이터가 들어오면 변경해야 함
  battery: number; 
}


export default function SensorScreen() {
  const [liveData, setLiveData] = useState<LiveSensorDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 10초마다 데이터를 새로고침하는 로직
  useEffect(() => {
    const loadData = async () => {
      try {
        // 최초 로딩이 아니라면 로딩 상태를 보여줄 필요는 없음 (부드러운 업데이트를 위해)
        if (liveData === null) setIsLoading(true); 

        const data = await fetchLiveSensorData();
        setLiveData(data);
        setError(null);
      } catch (err) {
        console.error("센서 데이터 로딩 실패:", err);
        setError("데이터를 불러오는 데 실패했습니다. (API 확인 필요)");
      } finally {
        setIsLoading(false);
      }
    };

    loadData(); // 컴포넌트 마운트 시 최초 실행

    // 10초마다 데이터 새로고침 (실시간 모니터링)
    const intervalId = setInterval(loadData, 10000); 

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  // -----------------------------------------------------------
  // 🔑 1차 방어: 오류, 로딩 중, 데이터 null 시 즉시 화면 반환
  // -----------------------------------------------------------
  if (error) {
    return (
      <div className="p-4 flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center">
        <p className="text-xl text-red-600 font-bold">🚨 API 연결 오류 🚨</p>
        <p className="text-gray-700 mt-2">{error}</p>
        <p className="text-sm text-gray-500 mt-4">백엔드 서버(Render) 상태 및 URL 경로가 올바른지 확인해주세요.</p>
      </div>
    );
  }
  
  if (isLoading || liveData === null) {
    return (
      <div className="p-4 flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-lg text-gray-500">
          실시간 센서 데이터를 불러오는 중...
        </p>
      </div>
    );
  }



  // --- 데이터 가공 로직 ---
  // 백엔드에서 받은 데이터를 UI에 맞게 변환
  const processedData: DisplaySensorData = {
    // 백엔드에서 tilt는 단일 값으로 오므로, 임의로 X, Y축으로 나눕니다.
    // (만약 백엔드에서 X, Y축을 따로 보낸다면 이 로직을 수정해야 합니다.)
    tiltX: liveData?.tilt !== null ? parseFloat(liveData.tilt.toFixed(1)) : 0.0,
    tiltY: 0.0, // 임시값: 현재 백엔드는 하나의 tilt만 제공합니다.
    
    temperature: liveData?.temperature !== null ? parseFloat(liveData.temperature.toFixed(1)) : 0.0,
    humidity: liveData?.humidity !== null ? parseFloat(liveData.humidity.toFixed(1)) : 0.0,
    
    // 진동/배터리 데이터는 현재 백엔드에서 제공되지 않으므로 임시값을 사용합니다.
    vibration: '정상', 
    battery: 85, 
  };
  // -------------------------


/*  if (error) {
    return <div className="p-4 text-red-600">오류: {error}</div>;
  }
  
  if (isLoading || liveData === null) {
    return (
      <div className="p-4 flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-lg text-gray-500">
          실시간 센서 데이터를 불러오는 중...
        </p>
      </div>
    );
  } */

  // 데이터 로딩 완료 후 렌더링
  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        📦 실시간 장치 모니터링
      </h1>
      
      {/* 1. 장치 상태 요약 (상단 - 배터리/연결은 임시값) */}
      <DeviceStatus 
        battery={processedData.battery} 
        connectionStatus="연결됨" 
      />

      {/* 2. 핵심 센서 데이터 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 기울기 (tilt 값을 X축으로 사용하고, 임계값을 5도로 가정) */}
        <SensorDataCard 
          title="기울기" 
          value={`${processedData.tiltX}°`} 
          status={Math.abs(processedData.tiltX) > 5 ? '경고' : '정상'}
          unit="도"
        />
        {/* 온도 */}
        <SensorDataCard 
          title="온도" 
          value={`${processedData.temperature}`} 
          status={processedData.temperature > 30 ? '경고' : '정상'}
          unit="°C"
        />
        {/* 습도 (새로 추가) */}
        <SensorDataCard 
          title="습도" 
          value={`${processedData.humidity}`} 
          status={processedData.humidity > 60 ? '경고' : '정상'}
          unit="%RH"
        />
        {/* 진동 (임시값) */}
        <SensorDataCard 
          title="진동" 
          value={processedData.vibration} 
          status={processedData.vibration === '감지됨' ? '경고' : '정상'}
          unit=""
        />
      </div>

      {/* 3. 기타 위젯 영역 (그래프 등) */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-2">최근 센서 변화 기록 (추후 구현)</h2>
        <p className="text-gray-500 text-sm">여기에 온도 및 기울기 변화 그래프가 표시될 예정입니다.</p>
      </div>
      
    </div>
  );
}
