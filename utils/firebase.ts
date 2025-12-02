// utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// SensorUDon의 firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyAdF_uw8WMgZK3BRF16Q1e0zk6nTInUaBY", 
  authDomain: "sensorudon.firebaseapp.com",
  projectId: "sensorudon",
  storageBucket: "sensorudon.firebasestorage.app",
  messagingSenderId: "400819120834",
  appId: "1:400819120834:web:272b689b49ba611ee5295b"
};

// 서버 사이드 렌더링(SSR) 지원을 위한 초기화 분기 처리
let messaging: any = null;

if (typeof window !== "undefined") {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

// 알림 권한 요청 및 토큰 가져오기 함수
export const requestForToken = async () => {
  if (!messaging) return;

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BLR5NzwFAOZwq5B1E75aG-AAHTPb6k5GJHmVDftAoFMv3xuC0YBlE6ct43AI0FiLQ6rUR62kmR65ZdVzJtxCPx0" 
      // 'Web Push 인증서'의 키 쌍 값
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);
      // 실제로는 이 토큰을 서버나 DB에 저장해야 나중에 이 기기로 알림을 쏠 수 있음
      return currentToken;
    } else {
      console.log("토큰을 가져올 수 없습니다. 권한이 허용되었나요?");
      return null;
    }
  } catch (err) {
    console.log("토큰 가져오기 에러:", err);
    return null;
  }
};

// [추가됨] 포그라운드(앱 켜져있을 때) 메시지 수신 처리
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging, getToken, onMessage };