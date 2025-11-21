"use client";

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
}
