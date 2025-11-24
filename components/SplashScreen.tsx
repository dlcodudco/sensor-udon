'use client';

import { useEffect, useContext } from 'react';
import { HideNavContext } from "../app/clientlayout"; // 경로 확인 필요!

export default function SplashScreen() {
  const { setHideNav } = useContext(HideNavContext);

  useEffect(() => {
    // 1. 화면이 뜨자마자 네비게이션 바 숨김
    setHideNav(true);
    
    // 2. 컴포넌트가 사라질 때(Unmount)는 자동으로 다시 보이게 할지, 
    //    아니면 다음 화면(온보딩 등)에서 제어할지에 따라 다르지만,
    //    보통은 여기서 false로 돌리지 않고 다음 화면에 맡기는 게 자연스럽습니다.
    //    (만약 바로 메인으로 간다면 return에서 false로 해주는 게 좋습니다.)
    
    return () => setHideNav(false); 
  }, [setHideNav]);

  return (
    <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-slate-50 flex flex-col items-center justify-center overscroll-none touch-none">
      
      {/* 🌟 전체 컨텐츠가 부드럽게 나타나도록 fade-in 적용 (선택사항, Tailwind 설정에 따라 다름) */}
      <div className="flex flex-col items-center animate-fade-in">
        
        {/* 로고 아이콘 영역 */}
        <div className="relative mb-8">
            {/* 배경의 은은한 파란색 빛 (Pulse 애니메이션 유지) */}
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-25 rounded-full animate-pulse"></div>
            
            {/* 🛵 🌟 핵심 변경: 스쿠터 아이콘에 통통 튀는 bounce 애니메이션 추가 */}
            <div className="relative animate-bounce">
              <span className="text-7xl drop-shadow-md">🛵</span>
            </div>
        </div>
        
        {/* 브랜드 이름 */}
        <h1 className="text-3xl font-black tracking-wider mb-6 text-slate-900">
          SAFE FOOD
        </h1>
        
        {/* 임팩트 있는 한 줄 */}
        <div className="flex flex-col items-center space-y-2">
            <p className="text-xl font-light text-slate-600">
              흔들림 없는 <strong className="text-slate-900 font-bold">맛</strong>
            </p>
            <p className="text-xl font-light text-slate-600">
              완벽한 <strong className="text-blue-600 font-bold">온도</strong>
            </p>
        </div>
      </div>

      {/* 🔥 하단 로딩 바 제거됨 */}

    </div>
  );
}