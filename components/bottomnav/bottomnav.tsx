"use client";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t flex justify-around items-center">
      <a href="/sensor">센서</a>
      <a href="/camera">카메라</a>
      <a href="/history">기록</a>
      <a href="/mypage">마이</a>
    </nav>
  );
}
