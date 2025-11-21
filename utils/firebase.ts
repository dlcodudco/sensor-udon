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

export { messaging, getToken, onMessage };