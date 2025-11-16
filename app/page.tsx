export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">

      {/* 제목 */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Sensor Udon Dashboard
      </h1>

      {/* 센서 카드 3개 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Temperature</h2>
          <p className="text-3xl font-bold text-blue-600">-- °C</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Humidity</h2>
          <p className="text-3xl font-bold text-green-600">-- %</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Tilt</h2>
          <p className="text-3xl font-bold text-red-600">-- °</p>
        </div>

      </div>

      {/* ESP32 카메라 */}
      <div className="bg-white p-6 rounded-xl shadow text-center max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">ESP32 Camera</h2>
        <img
          src="/placeholder.jpg"
          alt="Camera Stream"
          className="w-full rounded-lg border"
        />
      </div>

    </main>
  );
}
