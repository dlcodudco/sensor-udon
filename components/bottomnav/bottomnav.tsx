/*"use client";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t flex justify-around items-center pb-[env(safe-area-inset-bottom)]">
      <a href="/sensor">센서</a>
      <a href="/camera">카메라</a>
      <a href="/history">기록</a>
      <a href="/mypage">마이</a>
    </nav>
  );
}*/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname(); // 현재 주소를 가져오는 훅

  // 메뉴 리스트 (링크와 이모티콘 설정)
  const navItems = [
    { name: "센서", href: "/sensor", icon: "🌡️" }, // 센서 페이지 경로 확인 필요
    { name: "카메라", href: "/camera", icon: "📷" }, // 카메라 페이지 경로 확인 필요
    { name: "기록", href: "/history", icon: "📝" }, // 기록 페이지
    { name: "마이", href: "/mypage", icon: "🏠" },
  ];

  return (
    <nav
      className="
        fixed bottom-0 w-full z-50
        border-t border-gray-200
        
        /* 🎨 디자인 추천 1: 반투명 블러 효과 (아이폰 느낌) */
        bg-white/90 backdrop-blur-md
        
        /* 📏 높이 조정: 하단 안전 영역(pb-[env...]) + 넉넉한 상단 패딩 */
        pb-[env(safe-area-inset-bottom)]
        pt-3 
      "
    >
      {/* 높이를 h-16에서 h-20으로 늘려서 터치 영역 확보 */}
      <div className="flex justify-around items-start h-20">
        {navItems.map((item) => {
          // 현재 페이지인지 확인 (정확히 일치하거나 하위 경로일 경우)
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center w-full h-full
                transition-colors duration-200 ease-in-out
                /* 터치했을 때 약간 눌리는 느낌 추가 */
                active:scale-95
                /* 위쪽으로 공간을 확보하여 하단 바와 거리 두기 */
                -mt-1
              `}
            >
              {/* 아이콘 (이모티콘) */}
              <span className={`text-2xl mb-1 ${isActive ? "scale-110" : "opacity-70"}`}>
                {item.icon}
              </span>

              {/* 텍스트 라벨 */}
              <span
                className={`
                  text-xs font-medium
                  ${isActive 
                    ? "text-black-600 font-bold" // 🌟 활성 상태: 진하고 파란색
                    : "text-gray-400 font-normal" // 비활성 상태: 연한 회색
                  }
                `}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
