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
    
    // 1. 아이디와 비밀번호 검사 (하드코딩)
    if (email === "SafeFood01" && password === "safefood0101") {
      
      // 2. 로그인 성공 시: '로그인 되었다'는 표시를 저장함
      localStorage.setItem("isLoggedIn", "true");
      
      // 3. 페이지 이동 (센서 페이지로)
      router.replace('/sensor'); 
      
    } else {
      // 4. 로그인 실패 시: 경고창 띄우기
      alert("아이디 또는 비밀번호가 올바르지 않습니다.\n다시 확인해주세요.");
      
      // (선택사항) 비밀번호 입력창 초기화
      setPassword(""); 
    }
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
              className="
                w-full h-12 px-4 rounded-xl 
                border border-gray-200 bg-gray-50
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                outline-none transition-all 
                
                /* 👇 변경된 부분: 글자는 진하게(900), 안내 문구는 연하게(400) */
                text-gray-900 placeholder:text-gray-400
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full h-12 px-4 rounded-xl 
                border border-gray-200 bg-gray-50
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                outline-none transition-all 
                
                /* 👇 변경된 부분: 글자는 진하게(900), 안내 문구는 연하게(400) */
                text-gray-900 placeholder:text-gray-400
              "
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