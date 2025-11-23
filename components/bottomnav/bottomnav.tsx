/*"use client";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t flex justify-around items-center pb-[env(safe-area-inset-bottom)]">
      <a href="/sensor">센서</a>
      <a href="/camera">카메라</a>
      <a href="/history">기록</a>
      <a href="/mypage">마이</a>
    </nav>
  );
}*/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Thermometer, Camera, FileText, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: '센서', href: '/sensor', icon: Thermometer },
    { name: '카메라', href: '/camera', icon: Camera },
    { name: '기록', href: '/history', icon: FileText },
    { name: '마이', href: '/mypage', icon: User },
  ];

  // 🎨 [색상 설정] 여기를 바꾸면 포인트 색이 바뀝니다!
  // 추천 1: text-gray-900 / bg-gray-900 (시크한 블랙 - 현재 설정)
  // 추천 2: text-emerald-600 / bg-emerald-600 (안전한 느낌의 초록)
  // 추천 3: text-orange-500 / bg-orange-500 (식욕을 돋우는 주황)
  
  const activeColorClass = "text-gray-900"; // 아이콘/글자 색
  const activeBgClass = "bg-gray-900";     // 상단 인디케이터 바 색

  return (
    <nav className="
      fixed bottom-0 w-full z-50
      bg-white border-t border-gray-100
      pb-[env(safe-area-inset-bottom)] 
      shadow-[0_-5px_20px_rgba(0,0,0,0.02)]
    ">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex flex-col items-center justify-center w-full h-full
                transition-all duration-300
                active:bg-gray-50 /* 터치 시 아주 연한 회색 배경 */
              `}
            >
              {/* ✨ 상단 인디케이터 (선택되면 위에 뜨는 막대) */}
              {isActive && (
                <span className={`
                  absolute top-0 w-12 h-1 rounded-b-full 
                  ${activeBgClass} 
                  shadow-sm animate-fade-in
                `} />
              )}

              {/* 아이콘 + 텍스트 그룹 */}
              <div className={`
                flex flex-col items-center gap-1 transition-all duration-300
                ${isActive ? '-translate-y-0.5' : 'translate-y-0'}
              `}>
                <Icon 
                  size={24} 
                  className={`
                    transition-colors duration-300 
                    ${isActive ? activeColorClass : 'text-gray-400'}
                  `} 
                  // 선택됐을 때 아이콘 선을 조금 더 굵게(2.5) 처리
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                
                <span className={`
                  text-[10px] font-bold transition-colors duration-300
                  ${isActive ? activeColorClass : 'text-gray-400'}
                `}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}