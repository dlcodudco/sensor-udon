"use client";

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
      {/* 제목 */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Sensor Udon Dashboard
      </h1>

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
          <h2 className="text-xl font-semibold mb-2">Tilt</h2>
          <p className="text-3xl font-bold text-red-600">
            {loading ? "--" : sensor.tilt?.toFixed(1)} °
          </p>
        </div>

      </div>

      {/* ESP32 카메라 */}
      <div className="bg-white p-6 rounded-xl shadow text-center max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">ESP32 Camera</h2>
        <img
          src={CAMERA_URL + `?t=${Date.now()}`}
          alt="Camera Stream"
          className="w-full rounded-lg border"
        />
      </div>
    </main>
  );
}
