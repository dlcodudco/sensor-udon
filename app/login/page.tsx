'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HideNavContext } from "../../app/clientlayout"; // 경로 확인 필요
import Link from 'next/link';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  // 1. 로그인 화면에서도 하단 네비게이션 숨기기
  const { setHideNav } = useContext(HideNavContext);
  useEffect(() => {
    setHideNav(true);
    return () => setHideNav(false);
  }, [setHideNav]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 처리 후 메인으로 이동
    router.push('/sensor');
  };

  return (
    // 🌟 핵심: fixed inset-0으로 화면 고정 + 스크롤 원천 차단
    <div className="fixed inset-0 z-50 w-full h-[100dvh] overflow-hidden bg-white flex flex-col justify-center px-8 overscroll-none">
      
      {/* 로고 및 타이틀 영역 */}
      <div className="mb-12 text-center">
        <div className="text-6xl mb-4 animate-bounce-slow">🛵</div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Safe Food
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          스마트 배송 모니터링 시스템
        </p>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input 
            type="text" 
            placeholder="User ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50"
          />
        </div>

        {/* 로그인 버튼 (온보딩 버튼 스타일 통일) */}
        <button 
          type="submit"
          className="w-full h-14 mt-6 rounded-xl bg-gray-900 text-white font-bold text-lg shadow-lg shadow-gray-200 active:scale-95 transition-transform"
        >
          로그인
        </button>
      </form>

      {/* 추가 메뉴 (회원가입 등) */}
      <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400">
        
        {/* 회원가입 버튼 */}
        <button 
          type="button" // 폼 제출 방지
          onClick={() => alert("🚧 죄송합니다.\n현재 회원가입 화면은 준비 중입니다.")}
          className="hover:text-gray-900 transition-colors font-medium outline-none"
        >
          회원가입
        </button>

        {/* 구분선 */}
        <span className="w-[1px] h-4 bg-gray-300"></span>

        {/* 비밀번호 찾기 버튼 */}
        <button 
          type="button"
          onClick={() => alert("🚧 죄송합니다.\n비밀번호 찾기 기능은 준비 중입니다.")}
          className="hover:text-gray-900 transition-colors font-medium outline-none"
        >
          비밀번호 찾기
        </button>
        
      </div>

    </div>
  );
}