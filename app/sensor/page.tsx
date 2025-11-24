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


import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { RotateCw, Bell, AlertTriangle, CheckCircle, Package, Thermometer, Droplets, Activity, Wifi } from 'lucide-react'; 
import DeviceStatus from '../../components/sensor/devicestatus';
import { fetchLiveSensorData, LiveSensorDataResponse } from '../../utils/api';

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

  const loadData = async (isBackground = false) => {
    try {
      if (!isBackground) setIsFirstLoad(true);
      
      // 데이터 요청 시작 시 잠깐 '수신 중' 표시
      setIsUpdating(true);
      
      const data = await fetchLiveSensorData();
      setLiveData(data);
      setError(null);
    } catch (err) {
      console.error("센서 데이터 로딩 실패:", err);
      // 백그라운드 업데이트 중 에러는 사용자에게 큰 방해 안 되게 처리
      if (!isBackground) setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setIsFirstLoad(false);
      
      // 0.3초 뒤에 수신 표시 끔 (깜빡임 효과)
      setTimeout(() => setIsUpdating(false), 300);
    }
  };

  useEffect(() => {
    // 1. 최초 실행 (로딩 화면 보임)
    loadData(false); 

    // ⭐ 핵심 2: 1초(1000ms)마다 데이터 갱신 (실시간성 확보)
    // 기울기와 진동을 위해 주기를 짧게 잡음. 온도/습도도 같이 갱신되지만 문제없음.
    const intervalId = setInterval(() => {
      loadData(true); // true = 백그라운드 로딩 (화면 안 가림)
    }, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  // -----------------------------------------------------------
  // ⭐ 핵심: 기울기 감시 및 1.5초 후 자동 캡처 로직
  // -----------------------------------------------------------
  useEffect(() => {
    if (!liveData) return;

    const currentTilt = Math.abs(liveData.tilt ?? 0);

    // 1. 기울기가 10도를 넘었고 + 현재 캡처 예약이 안 걸려있다면
    if (currentTilt > 10 && !isCaptureScheduled.current) {
      
      console.log(`⚠️ 위험 기울기 감지(${currentTilt}도)! 1.5초 후 자동 캡처 예약됨...`);
      isCaptureScheduled.current = true; // 예약 걸림 표시 (중복 방지)

      // 2. 1.5초 타이머 시작
      setTimeout(() => {
        handleAutoCapture(currentTilt); // 1.5초 후 캡처 실행
        
        // (선택사항) 캡처 후 5초 동안은 다시 캡처 안 되게 쿨타임 주기
        setTimeout(() => {
            isCaptureScheduled.current = false; 
        }, 5000);

      }, 1500); // 1500ms = 1.5초
    }
  }, [liveData]); // liveData가 바뀔 때마다 실행됨

  // ⭐ 자동 캡처 실행 함수 (실제로는 백엔드에 저장 요청)
  const handleAutoCapture = (triggeredTilt: number) => {
    const timestamp = new Date().toISOString();
    
    // 1. 새로운 이벤트 데이터 생성
    const newEvent = {
      id: Date.now(), // 현재 시간을 ID로 사용 (고유값)
      timestamp: timestamp,
      eventType: '기울기', // 타입 지정
      eventValue: triggeredTilt,
      message: `위험 기울기 ${triggeredTilt}° 감지 후 자동 캡처됨.`,
      isAlert: true,
      // 실제 카메라 연동 전이라 더미 이미지 사용 (나중에 실제 스냅샷 URL로 교체)
      imageUrl: `https://placehold.co/600x400/f97316/ffffff?text=Auto+Capture+${triggeredTilt}deg`,
    };

    // 2. 기존 기록 가져오기 (없으면 빈 배열)
    const storedHistory = localStorage.getItem('appHistory');
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    // 3. 새 기록을 맨 앞에 추가
    const updatedHistory = [newEvent, ...historyArray];

    // 4. 저장소에 다시 저장
    localStorage.setItem('appHistory', JSON.stringify(updatedHistory));

    // 알림 (테스트용)
    console.log("📸 자동 캡처 저장 완료:", newEvent);
  };

  // --- 헬퍼 함수 ---
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

  // -----------------------------------------------------------
  // 에러 화면 (최초 로딩 실패 시에만)
  // -----------------------------------------------------------
  if (error && isFirstLoad) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-50 text-center z-50">
        <p className="text-xl text-red-600 font-bold">🚨 연결 오류</p>
        <button onClick={() => loadData(false)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">재시도</button>
      </div>
    );
  }
  
  // -----------------------------------------------------------
  // 최초 로딩 화면 (이후 업데이트 때는 안 뜸!)
  // -----------------------------------------------------------
  if (isFirstLoad || liveData === null) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-50 z-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">센서 연결 중...</p>
      </div>
    );
  }

  const processedData: DisplaySensorData = {
    tiltX: liveData?.tilt !== null ? parseFloat(liveData.tilt.toFixed(1)) : 0.0,
    tiltY: 0.0,
    temperature: liveData?.temperature !== null ? parseFloat(liveData.temperature.toFixed(1)) : 0.0,
    humidity: liveData?.humidity !== null ? parseFloat(liveData.humidity.toFixed(1)) : 0.0,
    vibration: '정상', // 테스트 시 '감지됨'으로 변경해서 확인 가능
    battery: 85,
  };

  const tiltInfo = getTiltStatus(processedData.tiltX);
  const humidInfo = getHumidStatus(processedData.humidity);

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {/* 헤더 */}
      <header className="flex-none bg-white z-30 flex items-center justify-between px-6 border-b border-gray-100 shadow-sm pt-[calc(env(safe-area-inset-top)+16px)] pb-4">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold text-gray-900">📦 실시간 모니터링</h1>
           
           {/* 🔴 LIVE 배지: 빨간 점에만 애니메이션(ping) 다시 적용 */}
           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 border border-red-100 rounded-md ml-1">
              {/* 👇 여기가 애니메이션 핵심 부분 */}
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-extrabold text-red-600 tracking-wider">LIVE</span>
           </div>
        </div>

        <div className="flex gap-4 text-gray-500">
          {/* 🔄 새로고침 버튼: 여전히 정지 상태 (누를 때만 살짝 반응) */}
          <button 
            onClick={() => loadData(true)} 
            className="hover:text-blue-600 transition p-1 active:rotate-180 duration-300"
          >
            <RotateCw size={20} />
          </button>
          
          <button className="hover:text-blue-600 transition p-1">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-y-auto p-6 pb-[calc(100px+env(safe-area-inset-bottom))] overscroll-y-contain -webkit-overflow-scrolling-touch">
        <div className="space-y-6">
          
          <DeviceStatus battery={processedData.battery} connectionStatus="연결됨" />

          {/* 🌟 1. 기울기 시각화 (실시간 반영) */}
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
                {/* ✅ 배경 이미지 적용 (public/images/bg.png 가정) */}
                <Image 
                  src="/images/bg.png"  // 👈 실제 배경 파일명으로 변경!
                  alt="배경" 
                  fill 
                  className="object-cover opacity-80" // 약간 투명하게 해서 주인공 강조
                  priority // 중요한 이미지라 먼저 로딩
                />
                
                {/* 📦 움직이는 박스 이미지 */}
                <div 
                  className="relative z-10 w-32 h-32 transition-transform duration-700 ease-out drop-shadow-2xl"
                  style={{ transform: `rotate(${processedData.tiltX}deg)` }} 
                >
                  <Image 
                    src="/images/box.png"
                    alt="배달통" 
                    fill // 부모 div(w-32 h-32) 크기에 꽉 차게 자동 조절
                    // 👇 object-contain 중복 제거하고 mix-blend-multiply 적용
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
                   <p className="text-xs text-gray-500 mt-1">{humidInfo.text}</p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                   <div className={`h-full ${humidInfo.color} transition-all duration-1000`} style={{ width: `${Math.min(processedData.humidity, 100)}%` }}></div>
                </div>
             </div>

             {/* 진동 카드 (애니메이션 적용) */}
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