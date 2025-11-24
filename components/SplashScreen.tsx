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
    // 🟡 변경됨: 배경을 어두운 색(bg-slate-900)에서 밝은 색(bg-slate-50)으로 변경
    <div className="fixed inset-0 z-[100] w-full h-[100dvh] bg-slate-50 flex flex-col items-center justify-center overscroll-none touch-none">
      
      <div className="flex flex-col items-center">
        {/* 로고 아이콘 */}
        <div className="relative mb-8">
            {/* 🟡 변경됨: 뒤에 빛나는 효과를 은은하게 조정 (opacity 조절) */}
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <span className="relative text-6xl drop-shadow-sm">🛵</span>
        </div>
        
        {/* 🟡 변경됨: 브랜드 이름 글씨색 (White -> Dark Slate) */}
        <h1 className="text-3xl font-black tracking-wider mb-6 text-slate-900">
          SAFE FOOD
        </h1>
        
        {/* ✨ 임팩트 있는 한 줄 */}
        <div className="flex flex-col items-center space-y-1">
            {/* 🟡 변경됨: 설명 글씨색 (Gray -> Slate-500 & 900) */}
            <p className="text-xl font-light text-slate-500">
              흔들림 없는 <strong className="text-slate-900 font-bold">맛</strong>
            </p>
            <p className="text-xl font-light text-slate-500">
              완벽한 <strong className="text-blue-600 font-bold">온도</strong>
            </p>
        </div>
      </div>

      {/* 하단 로딩 바 */}
      {/* 🟡 변경됨: 로딩 바 배경색 (Dark -> Light Gray) */}
      <div className="absolute bottom-20 w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-loading-bar w-full origin-left"></div>
      </div>

    </div>
  );
}