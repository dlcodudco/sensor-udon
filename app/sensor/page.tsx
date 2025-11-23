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
import { RotateCw, Bell } from 'lucide-react'; // 아이콘 추가 (없으면 npm install lucide-react)
import SensorDataCard from '../../components/sensor/sensordatacard';
import DeviceStatus from '../../components/sensor/devicestatus';
import { fetchLiveSensorData, LiveSensorDataResponse } from '../../utils/api';

// 데이터 타입 정의
interface DisplaySensorData {
  tiltX: number;
  tiltY: number;
  temperature: number;
  humidity: number;
  vibration: '정상' | '감지됨';
  battery: number;
}

export default function SensorScreen() {
  const [liveData, setLiveData] = useState<LiveSensorDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩 함수 (수동 새로고침을 위해 밖으로 뺌)
  const loadData = async () => {
    try {
      // 최초 로딩이 아닐 때만 로딩 표시 (부드러운 UX)
      if (liveData === null) setIsLoading(true); 

      const data = await fetchLiveSensorData();
      setLiveData(data);
      setError(null);
    } catch (err) {
      console.error("센서 데이터 로딩 실패:", err);
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 10초마다 자동 새로고침
  useEffect(() => {
    loadData(); 
    const intervalId = setInterval(loadData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // -----------------------------------------------------------
  // 1. 로딩 & 에러 화면 (화면 중앙 고정)
  // -----------------------------------------------------------
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-50 text-center z-50">
        <p className="text-xl text-red-600 font-bold">🚨 API 연결 오류</p>
        <p className="text-gray-700 mt-2">{error}</p>
        <button onClick={loadData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">다시 시도</button>
      </div>
    );
  }
  
  if (isLoading || liveData === null) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-50 z-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">센서 데이터 연결 중...</p>
      </div>
    );
  }

  // 데이터 가공
  const processedData: DisplaySensorData = {
    tiltX: liveData?.tilt !== null ? parseFloat(liveData.tilt.toFixed(1)) : 0.0,
    tiltY: 0.0,
    temperature: liveData?.temperature !== null ? parseFloat(liveData.temperature.toFixed(1)) : 0.0,
    humidity: liveData?.humidity !== null ? parseFloat(liveData.humidity.toFixed(1)) : 0.0,
    vibration: '정상',
    battery: 85,
  };

  // -----------------------------------------------------------
  // 2. 메인 렌더링 (아이폰 노치 대응 완벽 적용 버전)
  // -----------------------------------------------------------
  return (
    // 🔴 1. 최상위 컨테이너: fixed inset-0으로 화면 고정 (스크롤 튕김 방지)
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {/* 🔴 2. 헤더: 노치 영역만큼 패딩 추가 (글자 잘림 해결) */}
      <header className="
        flex-none bg-white z-30 
        flex items-center justify-between px-6
        border-b border-gray-100 shadow-sm
        
        /* 👇 핵심: 노치 높이(env) + 16px 여유 공간 확보 */
        pt-[calc(env(safe-area-inset-top)+16px)] 
        pb-4
      ">
        <h1 className="text-xl font-bold text-gray-900">📦 실시간 모니터링</h1>
        <div className="flex gap-4 text-gray-500">
          {/* 새로고침 버튼에 기능 연결 */}
          <button onClick={loadData} className="hover:text-blue-600 transition p-1">
            <RotateCw size={20} />
          </button>
          <button className="hover:text-blue-600 transition p-1">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* 🔴 3. 본문: 여기만 스크롤 가능 */}
      <main className="
        flex-1 overflow-y-auto 
        p-6 pb-[calc(100px+env(safe-area-inset-bottom))] /* 하단바 가림 방지 여유 공간 넉넉히 */
        overscroll-y-contain
        -webkit-overflow-scrolling-touch /* 아이폰 스크롤 부드럽게 */
      ">
        <div className="space-y-6">
          
          {/* 1. 장치 상태 요약 */}
          <DeviceStatus 
            battery={processedData.battery} 
            connectionStatus="연결됨" 
          />

          {/* 2. 핵심 센서 데이터 그리드 */}
          <div className="grid grid-cols-2 gap-4">
            <SensorDataCard 
              title="기울기" 
              value={`${processedData.tiltX}°`} 
              status={Math.abs(processedData.tiltX) > 5 ? '경고' : '정상'}
              unit="도"
            />
            <SensorDataCard 
              title="온도" 
              value={`${processedData.temperature}`} 
              status={processedData.temperature > 30 ? '경고' : '정상'}
              unit="°C"
            />
            <SensorDataCard 
              title="습도" 
              value={`${processedData.humidity}`} 
              status={processedData.humidity > 60 ? '경고' : '정상'}
              unit="%RH"
            />
            <SensorDataCard 
              title="진동" 
              value={processedData.vibration} 
              status={processedData.vibration === '감지됨' ? '경고' : '정상'}
              unit=""
            />
          </div>

          {/* 3. 기타 위젯 영역 (그래프 등) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-2">최근 기록</h2>
            <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-sm">
              그래프 데이터 준비 중...
            </div>
          </div>

          {/* 스크롤 테스트를 위한 여백 (필요 없으면 삭제 가능) */}
          <div className="h-10"></div>
        </div>
      </main>
    </div>
  );
}