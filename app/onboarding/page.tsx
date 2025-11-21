'use client';

import { useRouter } from 'next/navigation';
// 기존에 만들어둔 컴포넌트 import (경로가 맞는지 확인해주세요!)
import OnboardingScreen from '../../components/onboarding/onboardingscreen';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    // 온보딩 완료 시 로직
    console.log("온보딩 완료! 로그인 화면으로 이동합니다.");
    
    // 실제 앱에서는 여기서 로컬 스토리지에 '온보딩 완료' 상태를 저장해야 합니다.
    // localStorage.setItem('isOnboardingCompleted', 'true');

    // 로그인 페이지로 이동
    router.replace('/login');
  };

  return (
    <OnboardingScreen onComplete={handleComplete} />
  );
}