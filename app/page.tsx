/*"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [sensor, setSensor] = useState({
    temperature: null as number | null,
    humidity: null as number | null,
    tilt: null as number | null,
  });

  const [loading, setLoading] = useState(true);

  // Render API URL (센서)
  const SENSOR_API = "https://sensorudon-backend.onrender.com/sensor";

  // ESP32 카메라 URL (로컬 네트워크)
  const CAMERA_URL = "http://172.20.10.4/capture";

  // ● 센서 데이터 자동 Fetch (3초 주기)
  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const res = await fetch(SENSOR_API);
        const data = await res.json();

        setSensor({
          temperature: data.temperature,
          humidity: data.humidity,
          tilt: data.tilt,
        });

        setLoading(false);
      } catch (err) {
        console.error("센서 데이터 가져오기 오류:", err);
      }
    };

    fetchSensor();            // 첫 실행
    const interval = setInterval(fetchSensor, 3000); // 3초마다 실행

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* 제목 */
/*      <h1 className="text-3xl font-bold text-center mb-8">
        Sensor Udon Dashboard
      </h1>

      {/* 센서 카드 3개 */
/*      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        {/* Temperature */
/*        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Temperature</h2>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? "--" : sensor.temperature?.toFixed(1)} °C
          </p>
        </div>

        {/* Humidity */
/*        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Humidity</h2>
          <p className="text-3xl font-bold text-green-600">
            {loading ? "--" : sensor.humidity?.toFixed(1)} %
          </p>
        </div>

        {/* Tilt */
/*        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Tilt</h2>
          <p className="text-3xl font-bold text-red-600">
            {loading ? "--" : sensor.tilt?.toFixed(1)} °
          </p>
        </div>

      </div>

      {/* ESP32 카메라 */
/*      <div className="bg-white p-6 rounded-xl shadow text-center max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">ESP32 Camera</h2>
        <img
          src={CAMERA_URL + `?t=${Date.now()}`}
          alt="Camera Stream"
          className="w-full rounded-lg border"
        />
      </div>
    </main>
  );
} */


"use client";

import { useEffect, useState } from "react";
// @/components/onboarding/OnboardingScreen으로 경로를 명확히 가정합니다.
import OnboardingScreen from '@/onboarding/onboardingscreen';

// ----------------------------------------------------
// Home 컴포넌트 시작
// ----------------------------------------------------
export default function Home() {
  // 상수 정의 (컴포넌트 내부에 위치)
  const SENSOR_API = "https://sensorudon-backend.onrender.com/sensor";
  const CAMERA_URL = "http://172.20.10.4/capture";

  // 상태 정의
  const [sensor, setSensor] = useState({
    temperature: null as number | null,
    humidity: null as number | null,
    tilt: null as number | null,
  });
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [loading, setLoading] = useState(true);

  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true);
    // TODO: 여기에 로컬 스토리지를 사용하여 다음 접속 시 건너뛰는 로직 추가
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // ● 센서 데이터 자동 Fetch (3초 주기) - useEffect 훅 사용
  useEffect(() => {
    // 이미 로그인까지 완료되어 대시보드가 보여질 때만 Fetch를 실행합니다.
    if (!isLoggedIn) return; 
    
    const fetchSensor = async () => {
      try {
        const res = await fetch(SENSOR_API);
        const data = await res.json();

        setSensor({
          temperature: data.temperature,
          humidity: data.humidity,
          tilt: data.tilt,
        });

        setLoading(false);
      } catch (err) {
        console.error("센서 데이터 가져오기 오류:", err);
      }
    };

    fetchSensor(); // 첫 실행
    const interval = setInterval(fetchSensor, 3000); // 3초마다 실행

    return () => clearInterval(interval);
  }, [isLoggedIn]); // isLoggedIn 상태가 true가 될 때만 실행되도록 종속성 추가

  // ----------------------------------------------------
  // 렌더링 조건부 분기
  // ----------------------------------------------------

  // 1. 온보딩 화면
  if (!onboardingCompleted) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // 2. 로그인 화면 (임시)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-xl font-semibold mb-4">로그인 화면 (임시)</h1>
        <button onClick={handleLogin} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
          로그인하고 대시보드로 이동
        </button>
      </div>
    );
  }

  // 3. 메인 센서 화면 (Dashboard)
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Sensor Udon Dashboard
      </h1>

      {loading && (
        <div className="text-center text-xl text-gray-500">데이터 로딩 중...</div>
      )}

      {/* 센서 카드 3개 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        {/* Temperature */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Temperature</h2>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? "--" : sensor.temperature?.toFixed(1)} °C
          </p>
        </div>

        {/* Humidity */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Humidity</h2>
          <p className="text-3xl font-bold text-green-600">
            {loading ? "--" : sensor.humidity?.toFixed(1)} %
          </p>
        </div>

        {/* Tilt */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Tilt (기울기)</h2>
          <p className="text-3xl font-bold text-red-600">
            {loading ? "--" : sensor.tilt?.toFixed(1)} °
          </p>
        </div>

      </div>

      {/* ESP32 카메라 */}
      <div className="bg-white p-6 rounded-xl shadow text-center max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">ESP32 Camera Stream</h2>
        {/* Date.now()를 사용하여 캐시 방지 및 실시간 스트리밍 시도 */}
        <img
          src={CAMERA_URL + `?t=${Date.now()}`}
          alt="Camera Stream"
          className="w-full rounded-lg border"
        />
      </div>
    </main>
  );
}