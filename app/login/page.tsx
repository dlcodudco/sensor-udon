'use client';

import { useState } from "react"; 

// 함수 이름을 Page로 변경하여 Next.js 규칙을 명확히 따름
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      console.log(`로그인 시도: ${username}`);
      // 메인 화면으로 이동
      window.location.href = '/sensor'; 
    } else {
      console.log("아이디와 비밀번호를 입력해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl space-y-6">
        
        <h1 className="text-3xl font-bold text-center text-gray-900">SensorUDon 로그인</h1>
        <p className="text-center text-sm text-gray-500">캡스톤 장치 모니터링을 시작합니다.</p>

        {/* 아이디 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          로그인
        </button>

        {/* 회원가입 링크 */}
        <div className="text-center text-sm">
          <a href="/signup" className="text-blue-500 hover:underline">
            회원가입
          </a>
        </div>

      </div>
    </div>
  );
}