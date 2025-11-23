/*"use client";

import { usePathname } from "next/navigation";
import BottomNav from "../components/bottomnav/bottomnav";
import { createContext, useState, useContext } from "react";

export const HideNavContext = createContext<any>(null);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hideNav, setHideNav] = useState(false);

  //const hideNavPaths = ["/onboardingscreen", "/loginscreen"];
  //const shouldHideNav = hideNavPaths.includes(pathname);

  return (
     <HideNavContext.Provider value={{ hideNav, setHideNav }}>
      {children}
      {!hideNav && <BottomNav />}
    </HideNavContext.Provider>
    //<>
    //  {children}
    //  {!shouldHideNav && <BottomNav />}
    //</>
  );
}*/

'use client';

import { usePathname } from "next/navigation";
import BottomNav from "../components/bottomnav/bottomnav";
import { createContext, useState } from "react";

export const HideNavContext = createContext<any>(null);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hideNav, setHideNav] = useState(false); // Context를 통한 강제 숨김 상태

  // ----------------------------------------------------
  // 최종 해결책: 경로(Path) 기반으로 내비게이션 바 숨김
  // ----------------------------------------------------
  // Nav Bar를 무조건 숨겨야 하는 경로를 명시합니다.
  const hideNavPaths = [
    "/onboarding", 
    "/onboardingscreen", // 혹시 모를 경로 대소문자 문제 대비
    "/login",
    "/loginscreen"
  ];

  // 1. 경로 목록에 포함되면 숨깁니다.
  const shouldHideByPath = hideNavPaths.some(path => pathname.startsWith(path));

  // 2. (Context를 통한) 컴포넌트 내부 요청이 들어오거나, 경로 기반 숨김 요청이 있으면 숨김
  const shouldHideNav = hideNav || shouldHideByPath;
  // ----------------------------------------------------

  return (
     <HideNavContext.Provider value={{ hideNav, setHideNav }}>
    {/* 1. 가장 바깥 div에 상단 노치(Top) 패딩. */}
    <div className="min-h-screen pt-[env(safe-area-inset-top)]">
      
      {/* 2. children(페이지 내용)은 여기에 한 번만 */}
      {/* pb-24는 하단 네비게이션 높이만큼 내용이 가려지지 않게 띄워주는 역할 */}
      <main className="pb-24"> 
        {children}
      </main>

      {/* 3. 하단 네비게이션 */}
      {!shouldHideNav && <BottomNav />}
    </div>
  </HideNavContext.Provider>
  );
}
