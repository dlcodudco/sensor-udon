// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// utils/firebase.ts와 동일한 Config (Service Worker는 별도 스레드라 import 불가)
const firebaseConfig = {
  apiKey: "AIzaSyAdF_uw8WMgZK3BRF16Q1e0zk6nTInUaBY", 
  authDomain: "sensorudon.firebaseapp.com",
  projectId: "sensorudon",
  storageBucket: "sensorudon.firebasestorage.app",
  messagingSenderId: "400819120834",
  appId: "1:400819120834:web:272b689b49ba611ee5295b"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // public 폴더에 아이콘이 있다면 경로 지정
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});