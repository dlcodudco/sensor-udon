// hooks/useSafetyAlert.ts
import { useEffect, useRef, useState } from 'react';

interface SensorData {
  tiltX: number;     
  temperature: number;
  humidity: number;
}

export const useSafetyAlert = (data: SensorData) => {
  const lastTiltAlert = useRef<number>(0);
  const lastTempAlert = useRef<number>(0);
  const COOLDOWN = 5000; // 5초마다 안내 (너무 시끄럽지 않게)

  // 위험 상태인지 여부를 UI에 알려주기 위한 state
  const [isDanger, setIsDanger] = useState(false);

  // 🗣️ TTS (텍스트를 음성으로 읽어줌)
  const speak = (message: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // 기존에 말하던 게 있으면 취소 (겹침 방지)
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'ko-KR'; // 한국어 설정
      utterance.rate = 1.0;     // 속도
      utterance.volume = 1.0;   // 볼륨
      window.speechSynthesis.speak(utterance);
    }
  };

  // 📳 진동
  const triggerVibration = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 1000]); // 길게 징-징-지이잉
    }
  };

  useEffect(() => {
    const now = Date.now();
    let dangerDetected = false; // 이번 턴에 위험이 있는지 체크

    // 1. 기울기 감시 (15도 이상)
    if (Math.abs(data.tiltX) >= 15) {
      dangerDetected = true;
      if (now - lastTiltAlert.current > COOLDOWN) {
        console.warn("🚨 기울기 위험!");
        triggerVibration();
        speak("배달통이 심하게 기울어졌습니다! 확인하세요."); // 👈 목소리로 경고!
        lastTiltAlert.current = now;
      }
    }

    // 2. 온도 감시
    if (data.temperature >= 40) {
      // 온도는 위험하긴 한데, 기울기만큼 급박하진 않으니 화면 표시 위주
      if (now - lastTempAlert.current > 10000) { // 10초 쿨타임
        triggerVibration();
        speak("온도가 너무 높습니다.");
        lastTempAlert.current = now;
      }
    }

    // 위험 상태 업데이트 (화면 빨갛게 만들기 위해)
    setIsDanger(dangerDetected);

  }, [data]);

  // UI에서 화면 색깔을 바꾸기 위해 danger 상태를 반환
  return { isDanger };
};