// utils/api.ts (새 파일 생성)

/*// 🚨 백엔드 API 엔드포인트를 여기에 맞게 수정하세요.
const API_BASE_URL = 'https://sensorudon-backend.onrender.com'; 
const SENSOR_ENDPOINT = '/sensor'; // 백엔드 main.py에서 확인된 경로

export interface LiveSensorData {
  tiltX: number;
  tiltY: number;
  temperature: number;
  vibrationStatus: 'NORMAL' | 'DETECTED';
  batteryPercent: number;
}

export async function fetchLiveSensorData(): Promise<LiveSensorData> {
  // 실제 API 호출 로직
  // const response = await fetch(`${API_BASE_URL}/sensors/live`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch sensor data');
  // }
  // return response.json();

  // ⭐⭐ 임시 Mocking 데이터 ⭐⭐
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연
  return {
    tiltX: parseFloat((Math.random() * 10 - 5).toFixed(1)),
    tiltY: parseFloat((Math.random() * 10 - 5).toFixed(1)),
    temperature: parseFloat((20 + Math.random() * 10).toFixed(1)),
    vibrationStatus: Math.random() > 0.8 ? 'DETECTED' : 'NORMAL',
    batteryPercent: Math.floor(60 + Math.random() * 40),
  };
}*/

// utils/api.ts

// 🚨 렌더에 배포된 실제 백엔드 기본 주소입니다.
const API_BASE_URL = 'https://sensorudon-backend.onrender.com'; 
const SENSOR_ENDPOINT = '/sensor'; // 백엔드 main.py에서 확인된 경로

// 백엔드 응답 구조에 맞춘 인터페이스 정의
// main.py 코드에 따라 temperature, humidity, tilt 세 가지 키를 사용합니다.
export interface LiveSensorDataResponse {
  temperature: number | null; // ℃
  humidity: number | null;    // %RH
  tilt: number | null;        // deg
}

/**
 * 실시간 센서 데이터를 백엔드 API에서 가져옵니다.
 */
export async function fetchLiveSensorData(): Promise<LiveSensorDataResponse> {
  const url = `${API_BASE_URL}${SENSOR_ENDPOINT}`;
  
  // CORS 문제가 이미 백엔드에서 해결되었으므로 바로 fetch를 사용합니다.
  const response = await fetch(url, {
    method: 'GET', 
    cache: 'no-store' // 실시간 데이터이므로 캐시 사용 안함
  });

  if (!response.ok) {
    // HTTP 상태 코드가 200번대가 아니면 오류 처리
    throw new Error(`데이터 로딩 실패: HTTP ${response.status} (${response.statusText})`);
  }

  // 응답 데이터를 인터페이스에 맞춰 반환
  return response.json() as Promise<LiveSensorDataResponse>;
}