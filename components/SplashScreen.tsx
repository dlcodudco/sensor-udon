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
    // 3. 화면 전체를 덮는 스타일 (네비게이션 바보다 위에 뜨도록 z-index 높임)
    <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-white flex flex-col items-center justify-center overscroll-none touch-none">
      
      {/* 로고 애니메이션 */}
      <div className="flex flex-col items-center animate-pulse">
        <span className="text-6xl mb-4">🛵</span>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-widest">
          SAFE FOOD
        </h1>
        <p className="text-gray-400 text-xs mt-2 font-medium tracking-wider">
          APP PREPARING...
        </p>
      </div>

      {/* 하단 로딩 인디케이터 (스피너) */}
      <div className="absolute bottom-20">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>

    </div>
  );
}