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


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '../components/SplashScreen'; //  아까 만든 파일 경로 (위치에 맞게 수정 필요)

export default function RootPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true); // 스플래시 화면 보임 여부

  useEffect(() => {
    // 1. 앱 실행 후 2.5초 동안 대기 (스플래시 화면 보여주기)
    const timer = setTimeout(() => {
      setShowSplash(false); // 스플래시 끄기
      checkUserStatus();    // 상태 검사 및 이동 시작
    }, 2500);

    return () => clearTimeout(timer); // 메모리 누수 방지
  }, [router]);

  const checkUserStatus = () => {
    // 2. 온보딩 완료 여부 확인
    // 💡 중요: 아까 OnboardingScreen에서 'localStorage'에 저장했던 값을 여기서 읽어야 합니다.
    // 값이 없으면 false, 있으면 true로 처리
    const isOnboardingCompleted = localStorage.getItem('onboardingComplete') === 'true';

    // 3. 로그인 여부 확인 (임시: false)
    //const isLoggedIn = false;
    // localStorage에 'isLoggedIn'이라는 값이 있는지 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // 4. 상태에 따라 페이지 이동
    if (!isOnboardingCompleted) {
      router.replace('/onboarding'); // 온보딩 안 했으면 온보딩으로
    } else if (!isLoggedIn) {
      router.replace('/login');      // 온보딩은 했는데 로그인은 안 했으면 로그인으로
    } else {
      router.replace('/sensor');     // 둘 다 했으면 메인(센서)으로
    }
  };

  // 5. showSplash가 true일 때는 스플래시 화면만 렌더링 (다른 건 안 보임)
  if (showSplash) {
    return <SplashScreen />;
  }

  // 스플래시가 끝나고 페이지 이동이 일어나는 아주 짧은 찰나 (아무것도 안 보여줌)
  return null;
}