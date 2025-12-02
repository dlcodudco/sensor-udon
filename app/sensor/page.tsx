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


// pages/sensor/SensorScreen.tsx
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { RotateCw, Bell, AlertTriangle, CheckCircle, Package, Thermometer, Droplets, Activity } from 'lucide-react'; 
import DeviceStatus from '../../components/sensor/devicestatus';
import { fetchLiveSensorData, LiveSensorDataResponse } from '../../utils/api';
// 🟢 1. 알림 훅 추가
import { useSafetyAlert } from '../../hooks/useSafetyAlert';

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
  const [isFirstLoad, setIsFirstLoad] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const isCaptureScheduled = useRef(false);

  // 🧪 테스트용 스위치 (누르면 강제로 위험 상황 연출)
  const [isTestMode, setIsTestMode] = useState(false);

  // 현재 데이터 계산 (테스트 모드면 강제값, 아니면 실제값)
  const currentTilt = isTestMode ? 25 : (liveData?.tilt ?? 0);
  const currentTemp = liveData?.temperature ?? 0;
  const currentHumid = liveData?.humidity ?? 0;

  // 🟢 2. 알림 감시자 연결 (음성 안내 + 화면 반짝임 상태 감지)
  const { isDanger } = useSafetyAlert({
    tiltX: currentTilt,
    temperature: currentTemp,
    humidity: currentHumid
  });

  const loadData = async (isBackground = false) => {
    try {
      if (!isBackground) setIsFirstLoad(true);
      setIsUpdating(true);
      const data = await fetchLiveSensorData();
      setLiveData(data);
      setError(null);
    } catch (err) {
      console.error("센서 데이터 로딩 실패:", err);
      if (!isBackground) setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setIsFirstLoad(false);
      setTimeout(() => setIsUpdating(false), 300);
    }
  };

  useEffect(() => {
    loadData(false); 
    const intervalId = setInterval(() => loadData(true), 1000); 
    return () => clearInterval(intervalId);
  }, []);

  // --- 자동 캡처 로직 (기존 유지) ---
  useEffect(() => {
    if (!liveData && !isTestMode) return;
    
    // 테스트 모드일 때도 캡처 로직이 돌도록 currentTilt 사용
    const checkTilt = Math.abs(currentTilt);

    if (checkTilt > 10 && !isCaptureScheduled.current) {
      console.log(`⚠️ 위험 기울기 감지(${checkTilt}도)! 1.5초 후 자동 캡처 예약됨...`);
      isCaptureScheduled.current = true;

      setTimeout(() => {
        handleAutoCapture(checkTilt);
        setTimeout(() => { isCaptureScheduled.current = false; }, 5000);
      }, 1500);
    }
  }, [currentTilt]); // liveData 대신 currentTilt 감시

  const handleAutoCapture = (triggeredTilt: number) => {
    const timestamp = new Date().toISOString();
    const newEvent = {
      id: Date.now(),
      timestamp: timestamp,
      eventType: '기울기',
      eventValue: triggeredTilt,
      message: `위험 기울기 ${triggeredTilt}° 감지 후 자동 캡처됨.`,
      isAlert: true,
      imageUrl: `https://placehold.co/600x400/f97316/ffffff?text=Auto+Capture+${triggeredTilt}deg`,
    };
    const storedHistory = localStorage.getItem('appHistory');
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];
    const updatedHistory = [newEvent, ...historyArray];
    localStorage.setItem('appHistory', JSON.stringify(updatedHistory));
    console.log("📸 자동 캡처 저장 완료:", newEvent);
  };

  // --- 헬퍼 함수 (기존 유지) ---
  const getTiltStatus = (deg: number) => {
    const absDeg = Math.abs(deg);
    if (absDeg > 15) return { color: 'text-red-600', bg: 'bg-red-50', text: '쏟아짐 주의! 🚨', border: 'border-red-500' };
    if (absDeg > 5) return { color: 'text-orange-500', bg: 'bg-orange-50', text: '약간 기울음', border: 'border-orange-400' };
    return { color: 'text-green-600', bg: 'bg-green-50', text: '아주 안정적 👍', border: 'border-blue-500' };
  };

  const getHumidStatus = (val: number) => {
    if (val > 80) return { text: '눅눅해요 💧', color: 'bg-blue-600' };
    if (val > 40) return { text: '적당해요 ✨', color: 'bg-cyan-500' };
    return { text: '건조해요 (바삭) ☀️', color: 'bg-orange-400' };
  };

  if (error && isFirstLoad) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-50 text-center z-50">
        <p className="text-xl text-red-600 font-bold">🚨 연결 오류</p>
        <button onClick={() => loadData(false)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">재시도</button>
      </div>
    );
  }
  
  if (isFirstLoad || liveData === null) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-50 z-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">센서 연결 중...</p>
      </div>
    );
  }

  // 데이터 처리 (테스트 모드 값 반영)
  const processedData: DisplaySensorData = {
    tiltX: parseFloat(currentTilt.toFixed(1)),
    tiltY: 0.0,
    temperature: parseFloat(currentTemp.toFixed(1)),
    humidity: parseFloat(currentHumid.toFixed(1)),
    vibration: '정상', 
    battery: 85,
  };

  const tiltInfo = getTiltStatus(processedData.tiltX);
  const humidInfo = getHumidStatus(processedData.humidity);

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {isDanger && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* 1. 배경: 전체적으로 붉은 기운이 돌면서 깜빡임 (테두리 X) */}
            <div className="absolute inset-0 bg-red-600/20 animate-pulse"></div>
            
            {/* 2. 그라데이션: 화면 위아래 가장자리를 좀 더 붉게 */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-600/30 via-transparent to-red-600/30"></div>

            {/* 3. 중앙 경고창: 깔끔한 흰색 박스 + 그림자 */}
            <div className="relative bg-white/95 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-2xl animate-bounce text-center border border-red-100 mx-4">
              <div className="text-4xl mb-2">🚨</div>
              <h1 className="text-2xl font-black text-red-600 leading-tight">위험 감지</h1>
              <p className="text-sm text-gray-500 font-bold mt-1">기울기를 확인하세요!</p>
            </div>
        </div>
      )}

      {/* 헤더 */}
      <header className="flex-none bg-white z-30 flex items-center justify-between px-6 border-b border-gray-100 shadow-sm pt-[calc(env(safe-area-inset-top)+16px)] pb-4">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold text-gray-900">📦 실시간 모니터링</h1>
           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 border border-red-100 rounded-md ml-1">
             <span className="relative flex h-1.5 w-1.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
             </span>
             <span className="text-[10px] font-extrabold text-red-600 tracking-wider">LIVE</span>
           </div>
        </div>

        <div className="flex gap-4 text-gray-500">
           {/* 🧪 테스트 버튼 (소리/화면 확인용) */}
          <button 
            onClick={() => setIsTestMode(!isTestMode)}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${isTestMode ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            {isTestMode ? '테스트 중' : '위험 테스트'}
          </button>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-y-auto p-6 pb-[calc(100px+env(safe-area-inset-bottom))] overscroll-y-contain -webkit-overflow-scrolling-touch">
        <div className="space-y-6">
          
          <DeviceStatus battery={processedData.battery} connectionStatus="연결됨" />

          {/* 🌟 1. 기울기 시각화 */}
          <div className={`relative bg-white p-6 rounded-3xl shadow-sm border-2 ${Math.abs(processedData.tiltX) > 15 ? 'border-red-100' : 'border-transparent'} overflow-hidden`}>
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h2 className="text-gray-500 text-sm font-bold flex items-center gap-1"><Package size={16}/> 수평 상태</h2>
                   <p className={`text-2xl font-bold mt-1 ${tiltInfo.color}`}>{tiltInfo.text}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${tiltInfo.bg} ${tiltInfo.color}`}>
                   {processedData.tiltX}° 기울음
                </div>
             </div>

             <div className="h-40 relative rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                {/* sizes 에러 해결 */}
                <Image 
                  src="/images/bg.png" 
                  alt="배경" 
                  fill 
                  sizes="100vw"
                  className="object-cover opacity-80" 
                  priority 
                />
                
                <div 
                  className="relative z-10 w-32 h-32 transition-transform duration-700 ease-out drop-shadow-2xl"
                  style={{ transform: `rotate(${processedData.tiltX}deg)` }} 
                >
                  <Image 
                    src="/images/box.png"
                    alt="배달통" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain mix-blend-multiply" 
                    priority
                  />
                </div>
             </div>
             <p className="text-xs text-gray-400 mt-3 text-center">오토바이의 기울기가 실시간으로 반영됩니다.</p>
          </div>

          {/* 🌟 2. 온도 & 습도 & 진동 */}
          <div className="grid grid-cols-2 gap-4">
              
             {/* 온도 */}
             <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                   <div className="p-2 bg-orange-50 text-orange-500 rounded-full"><Thermometer size={20}/></div>
                   <span className="text-xs text-gray-400">온도</span>
                </div>
                <div>
                   <p className="text-3xl font-bold text-gray-800">{processedData.temperature}<span className="text-lg text-gray-400 font-normal">°C</span></p>
                   {/* ✅ 기존 멘트 복구 완료 */}
                   <p className="text-xs text-gray-500 mt-1">
                      {processedData.temperature > 50 ? '너무 뜨거워요! 🔥' : '따뜻하게 유지 중 ♨️'}
                   </p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000" style={{ width: `${Math.min(processedData.temperature, 100)}%` }}></div>
                </div>
             </div>

             {/* 습도 */}
             <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                   <div className="p-2 bg-blue-50 text-blue-500 rounded-full"><Droplets size={20}/></div>
                   <span className="text-xs text-gray-400">습도</span>
                </div>
                <div>
                   <p className="text-3xl font-bold text-gray-800">{processedData.humidity}<span className="text-lg text-gray-400 font-normal">%</span></p>
                   {/* ✅ 기존 멘트 복구 완료 */}
                   <p className="text-xs text-gray-500 mt-1">{humidInfo.text}</p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                   <div className={`h-full ${humidInfo.color} transition-all duration-1000`} style={{ width: `${Math.min(processedData.humidity, 100)}%` }}></div>
                </div>
             </div>

             {/* ✅ 진동 카드 (완벽 복구) */}
             <div className={`col-span-2 bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between transition-colors duration-300 ${processedData.vibration === '감지됨' ? 'bg-red-50 border border-red-100' : ''}`}>
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-full transition-all duration-300 ${processedData.vibration === '감지됨' ? 'bg-red-100 text-red-500 animate-bounce' : 'bg-gray-100 text-gray-500'}`}>
                      <Activity size={24} />
                   </div>
                   <div>
                      <p className="text-sm text-gray-400 font-bold">진동 감지</p>
                      <p className={`text-lg font-bold transition-colors ${processedData.vibration === '감지됨' ? 'text-red-500' : 'text-gray-800'}`}>
                         {processedData.vibration === '감지됨' ? '충격 발생! 💥' : '안정적인 주행 중'}
                      </p>
                   </div>
                </div>
                {processedData.vibration === '감지됨' ? (
                   <div className="bg-red-100 p-2 rounded-full animate-pulse">
                      <AlertTriangle className="text-red-500" size={24} />
                   </div>
                ) : (
                   <CheckCircle className="text-green-500" size={24} />
                )}
             </div>
          </div>

          <div className="h-10"></div>
        </div>
      </main>
    </div>
  );
}