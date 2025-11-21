/*export default function MyPage() {
  return (
    <div>
      <h1>마이페이지</h1>
      <button>로그아웃</button>
    </div>
  );
}*/

'use client';

import React from 'react';
import { usePushNotification } from '../../hooks/usePushNotification';

const USER_INFO = {
  name: "캡스톤 앱 사용자",
  email: "capstone@ajbnu.ac.kr",
  deviceStatus: "연결됨",
  deviceId: "SENSOR-UDON-001A", 
  lastSync: "2025년 11월 21일 19:30",
};

interface SettingItemProps {
  title: string;
  value?: string;
  onClick?: () => void;
  isButton?: boolean;
  color?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ title, value, onClick, isButton = false, color = 'text-gray-900' }) => (
  <div 
    className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition duration-150 ${onClick ? 'hover:bg-gray-50' : ''}`}
    onClick={onClick}
  >
    <span className={`text-base font-medium ${color}`}>{title}</span>
    {value && <span className="text-gray-600 text-sm">{value}</span>}
    {isButton && (
        <span className={`text-sm font-semibold ${color}`}>
            {value} &gt;
        </span>
    )}
  </div>
);

export default function MyPageScreen() {
  // 푸시 알림 훅 사용
  const { requestPermission, permission, fcmToken } = usePushNotification();

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      console.log("로그아웃 처리됨");
      window.location.href = '/login';
    }
  };

  return (
    <div className="p-4 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        ⚙️ 마이페이지 및 설정
      </h1>

      {/* 1. 계정 정보 섹션 */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">계정 정보</h2>
        <SettingItem title="이름" value={USER_INFO.name} />
        <SettingItem title="이메일" value={USER_INFO.email} />
        <SettingItem 
          title="비밀번호 변경" 
          isButton={true} 
          value="변경" 
          onClick={() => alert("비밀번호 변경 페이지로 이동")} 
        />
      </div>

      {/* 2. 장치 관리 섹션 */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">장치 연결 상태</h2>
        <SettingItem title="장치 ID" value={USER_INFO.deviceId} />
        <SettingItem title="현재 연결 상태" value={USER_INFO.deviceStatus} color="text-green-600" />
      </div>

      {/* 3. 앱 설정 및 기타 */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">앱 설정</h2>
        
        {/* 클릭 시 requestPermission 함수 실행 */}
        <SettingItem 
          title="알림 설정 (권한 요청)" 
          isButton={true} 
          value={permission === 'granted' ? "ON (허용됨)" : "OFF (설정하기)"} 
          color={permission === 'granted' ? "text-blue-600" : "text-gray-500"}
          onClick={requestPermission} 
        />
        
        {/* 토큰이 발급되면 화면에 표시 (테스트용) */}
        {fcmToken && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs break-all text-gray-500 font-mono border border-gray-200">
                <span className="font-bold">FCM Token:</span> {fcmToken}
            </div>
        )}

        <SettingItem title="버전 정보" value="1.0.0 (Beta)" />
        <SettingItem 
          title="로그아웃" 
          isButton={true} 
          value="로그아웃" 
          color="text-red-600" 
          onClick={handleLogout} 
        />
      </div>
      
    </div>
  );
}