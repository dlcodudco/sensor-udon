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

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 앱이 시작되자마자 실행되는 로직
    const checkUserStatus = () => {
      // 1. 온보딩 완료 여부 확인
      const isOnboardingCompleted = false; 

      // 2. 로그인 여부 확인 (임시: 로그인 안 된 상태로 가정)
      const isLoggedIn = false; 

      // 3. 상태에 따라 페이지 이동 (리디렉션)
      if (!isOnboardingCompleted) {
        router.replace('/onboarding'); // 온보딩 안 했으면 온보딩으로
      } else if (!isLoggedIn) {
        router.replace('/login');      // 로그인 안 했으면 로그인 페이지로 이동
      } else {
        router.replace('/sensor');     // 로그인 했으면 센서 대시보드로
      }
    };

    checkUserStatus();
  }, [router]);

  // 리디렉션 되는 짧은 순간 보여줄 로딩 화면
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-medium">앱을 시작하는 중...</p>
    </div>
  );
}