import { useState, useEffect } from 'react';
import { messaging, getToken, onMessage } from '../utils/firebase';

export function usePushNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      // 1. 브라우저 알림 권한 요청
      const status = await Notification.requestPermission();
      setPermission(status);

      if (status === 'granted') {
        // 2. 권한 허용 시 토큰 발급
        // VAPID Key: Firebase 콘솔 -> 프로젝트 설정 -> 클라우드 메시징 -> 웹 구성 -> 키 쌍
        // 이 키를 꼭 본인의 키로 바꾸기
        const VAPID_KEY = "BLR5NzwFAOZwq5B1E75aG-AAHTPb6k5GJHmVDftAoFMv3xuC0YBlE6ct43AI0FiLQ6rUR62kmR65ZdVzJtxCPx0"; 
        
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (currentToken) {
          console.log("🔥 FCM Token 발급 성공:", currentToken);
          setFcmToken(currentToken);
          // TODO: 여기서 백엔드 API로 토큰을 전송하여 저장해야 합니다. (예: /api/register-token)
        } else {
          console.log("토큰을 가져올 수 없습니다.");
        }
      } else {
        console.log("알림 권한이 거부되었습니다.");
      }
    } catch (error) {
      console.error("알림 설정 중 오류 발생:", error);
    }
  };

  // 포그라운드(앱 켜져있을 때) 메시지 수신 리스너
  useEffect(() => {
    if (permission === 'granted' && messaging) {
      onMessage(messaging, (payload) => {
        console.log("🔔 포그라운드 알림 수신:", payload);
        // 여기서 토스트 메시지 등을 띄울 수 있습니다.
        alert(`[경고] ${payload.notification?.title}: ${payload.notification?.body}`);
      });
    }
  }, [permission]);

  return { permission, requestPermission, fcmToken };
}