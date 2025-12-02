// hooks/useSafetyAlert.ts
import { useEffect, useRef } from 'react';

// 센서 데이터 타입 (기울기, 온도, 습도)
interface SensorData {
  tiltX: number;     
  temperature: number;
  humidity: number;
}

export const useSafetyAlert = (data: SensorData) => {
  // 마지막으로 경고한 시간을 기억 (도배 방지용)
  const lastTiltAlert = useRef<number>(0);
  const lastTempAlert = useRef<number>(0);
  
  // 쿨타임 설정: 3초 (3초에 한 번씩만 울림)
  const COOLDOWN = 3000; 

  // 📳 진동 함수 (안드로이드 폰에서 '징-징-징' 하고 울립니다)
  const triggerVibration = () => {
    // navigator.vibrate가 지원되는 기기인지 확인
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      // 500ms 진동, 200ms 쉼, 500ms 진동
      navigator.vibrate([500, 200, 500]); 
    }
  };

  useEffect(() => {
    const now = Date.now();

    // ---------------------------------------------
    // 1. 기울기 감시 (15도 이상)
    // ---------------------------------------------
    // Math.abs를 써서 왼쪽(-15)이나 오른쪽(+15) 모두 잡습니다.
    if (Math.abs(data.tiltX) >= 15) {
      // 쿨타임이 지났는지 확인
      if (now - lastTiltAlert.current > COOLDOWN) {
        console.warn("🚨 위험! 오토바이 기울어짐!");
        
        // 1) 폰 진동 발사
        triggerVibration(); 
        
        // 2) 화면에 경고창 띄우기 (또는 토스트 메시지)
        // ※ 실제 주행 중에는 alert 창이 방해될 수 있으니, 나중에는 붉은색 화면 깜빡임으로 바꾸면 더 좋습니다.
        alert("🚨 [위험] 오토바이가 15도 이상 기울어졌습니다!"); 
        
        // 마지막 경고 시간 갱신
        lastTiltAlert.current = now;
      }
    }

    // ---------------------------------------------
    // 2. 온도 감시 (10도 이하 또는 40도 이상)
    // ---------------------------------------------
    if (data.temperature <= 10 || data.temperature >= 40) {
      if (now - lastTempAlert.current > COOLDOWN) {
        console.warn("🌡️ 온도 경고!");
        
        // 온도는 짧게 한번 '징-'
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(200);
        }
        
        alert(`🌡️ 온도 주의: 현재 ${data.temperature}도 입니다. 음식 상태를 확인하세요.`);
        
        lastTempAlert.current = now;
      }
    }

    // 습도 로직이 필요하면 여기에 똑같이 추가하면 됩니다.

  }, [data]); // 센서 데이터(data)가 변할 때마다 실행됨
};