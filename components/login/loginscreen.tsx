// components/login/LoginScreen.tsx

'use client';

import { useEffect, useContext } from "react";
import { HideNavContext } from "../../app/clientlayout";

export default function LoginScreen() {
  const { setHideNav } = useContext(HideNavContext);

  useEffect(() => {
    setHideNav(true);
    return () => setHideNav(false);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">로그인 화면 (임시)</h1>
    </div>
  );
}
