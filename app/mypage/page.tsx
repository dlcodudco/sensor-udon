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

// 임시 사용자 및 장치 정보
const USER_INFO = {
  name: "캡스톤 앱 사용자",
  email: "capstone@ajou.ac.kr",
  deviceStatus: "연결됨",
  deviceId: "SENSOR-UDON-001A", // 캡스톤 장치 고유 ID
  lastSync: "2025년 11월 21일 19:30",
};

interface SettingItemProps {
  title: string;
  value?: string;
  onClick?: () => void;
  isButton?: boolean;
  color?: string;
}

// 개별 설정 항목 컴포넌트
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
  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      // 🚨 실제 로그아웃 API 호출 및 상태 변경 로직
      console.log("로그아웃 처리됨");
      // 예: window.location.href = '/login';
    }
  };

  return (
    <div className="p-4 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        ⚙️ 마이페이지 및 설정
      </h1>

      {/* 1. 사용자 계정 섹션 */}
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

      {/* 2. 장치 관리 섹션 (가장 중요) */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">장치 연결 상태</h2>
        
        {/* 장치 고유 ID 표시 */}
        <SettingItem title="장치 ID" value={USER_INFO.deviceId} />
        
        {/* 연결 상태 표시 */}
        <SettingItem 
          title="현재 연결 상태" 
          value={USER_INFO.deviceStatus} 
          color={USER_INFO.deviceStatus === '연결됨' ? 'text-green-600' : 'text-red-600'} 
        />
        
        {/* 마지막 동기화 시간 */}
        <SettingItem title="최근 데이터 동기화" value={USER_INFO.lastSync} />

        {/* 장치 재연결 버튼 */}
        <SettingItem 
          title="장치 수동 재연결" 
          isButton={true} 
          value="재연결" 
          onClick={() => alert("장치 재연결 로직 실행")} 
        />
      </div>

      {/* 3. 앱 설정 및 기타 */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">앱 설정</h2>
        <SettingItem title="알림 설정" isButton={true} value="ON" onClick={() => alert("알림 설정 토글")} />
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
