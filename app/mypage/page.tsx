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
import { 
  Settings, Smartphone, LogOut, ChevronRight, 
  Bell, Shield, Lock 
} from 'lucide-react'; 

// 사용자 정보 (Mock Data)
const USER_INFO = {
  name: "캡스톤 앱 사용자",
  email: "safe_food@jbnu.ac.kr",
  deviceStatus: "연결됨",
  deviceId: "SAFE-FOOD-001A", 
  lastSync: "2025.11.21 19:30",
};

// 설정 아이템 컴포넌트
interface SettingItemProps {
  icon?: React.ReactNode;
  title: string;
  value?: string;
  onClick?: () => void;
  isDestructive?: boolean;
  showArrow?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, title, value, onClick, isDestructive = false, showArrow = false 
}) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center justify-between p-4 
      border-b border-gray-50 last:border-b-0 
      transition-colors duration-200
      ${onClick ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100' : ''}
    `}
  >
    <div className="flex items-center gap-3">
      {icon && (
        <div className={`p-2 rounded-full ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
          {icon}
        </div>
      )}
      <span className={`text-[15px] font-medium ${isDestructive ? 'text-red-600' : 'text-gray-700'}`}>
        {title}
      </span>
    </div>

    <div className="flex items-center gap-2">
      {value && <span className="text-sm text-gray-500 font-medium">{value}</span>}
      {showArrow && <ChevronRight size={16} className="text-gray-300" />}
    </div>
  </div>
);

export default function MyPageScreen() {
  // ❌ 삭제됨: const { requestPermission, permission, fcmToken } = usePushNotification();
  // 이유: 로컬 알림 방식으로 변경하면서 더 이상 필요 없음

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      console.log("로그아웃 처리됨");
      
      localStorage.removeItem("isLoggedIn"); 
      
      window.location.href = '/login';
    }
  };

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      
      {/* 헤더 */}
      <header className="
        flex-none bg-white z-30 
        flex items-center justify-between px-6
        border-b border-gray-100 shadow-sm
        pt-[calc(env(safe-area-inset-top)+16px)] 
        pb-4
      ">
        <h1 className="text-xl font-bold text-gray-900">⚙️ 내 정보</h1>
        <div className="flex gap-4 text-gray-500">
           <button className="hover:text-blue-600 transition p-1">
             <Settings size={22} />
           </button>
        </div>
      </header>

      {/* 본문 */}
      <main className="
        flex-1 overflow-y-auto 
        p-6 pb-[calc(100px+env(safe-area-inset-bottom))] 
        overscroll-y-contain
        -webkit-overflow-scrolling-touch
      ">
        <div className="space-y-6">
          
          {/* 1. 프로필 카드 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{USER_INFO.name}</h2>
              <p className="text-sm text-gray-500">{USER_INFO.email}</p>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block font-medium">
                Standard Plan
              </span>
            </div>
          </div>

          {/* 2. 장치 관리 섹션 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
              Device Management
            </h3>
            <SettingItem 
              icon={<Smartphone size={18} />} 
              title="연결된 장치" 
              value={USER_INFO.deviceId} 
            />
            <SettingItem 
              icon={<Shield size={18} />} 
              title="장치 상태" 
              value={USER_INFO.deviceStatus} 
            />
          </div>

          {/* 3. 앱 설정 섹션 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
              App Settings
            </h3>
            
            {/* 알림 설정: 이제 로컬 알림이 기본이므로 항상 ON으로 표시 */}
            <SettingItem 
              icon={<Bell size={18} />} 
              title="위험 알림(진동)" 
              value="ON" 
              onClick={() => alert("현재 진동 알림이 활성화되어 있습니다.")}
              showArrow
            />
            
            {/* 비밀번호 변경 */}
            <SettingItem 
              icon={<Lock size={18} />} 
              title="비밀번호 변경" 
              onClick={() => alert("비밀번호 변경 기능 준비 중")}
              showArrow
            />

             {/* 버전 정보 */}
             <SettingItem 
              icon={<Settings size={18} />} 
              title="버전 정보" 
              value="1.0.0 (Beta)" 
            />
          </div>

          {/* (FCM 토큰 표시 섹션은 삭제했습니다) */}

          {/* 4. 로그아웃 버튼 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
            <SettingItem 
              icon={<LogOut size={18} />} 
              title="로그아웃" 
              isDestructive 
              onClick={handleLogout}
            />
          </div>
          
          <p className="text-center text-xs text-gray-400 py-4">
            © 2025 Safe Food Project. All rights reserved.
          </p>

          <div className="h-4"></div>

        </div>
      </main>
    </div>
  );
}