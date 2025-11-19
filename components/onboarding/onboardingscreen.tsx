// components/onboarding/OnboardingScreen.tsx

'use client'; 

import { useState } from 'react';

// ⭐⭐ 1. onboardingSlides 데이터를 컴포넌트 파일 안에 직접 정의 ⭐⭐
const onboardingSlides = [
  {
    id: 1,
    title: "음식 파손, 이제 그만!",
    description: "배달 중 음식이 쏟아지거나 상하지 않을까 걱정하셨나요?",
    imageUrl: "/images/onboarding1.png",
    buttonText: "다음"
  },
  {
    id: 2,
    title: "스마트 수평 유지 시스템",
    description: "센서 기반의 실시간 제어로 99.9% 안전 배달을 보장합니다.",
    imageUrl: "/images/onboarding2.png",
    buttonText: "다음"
  },
  {
    id: 3,
    title: "실시간 데이터로 안심 배달",
    description: "기울기, 온도, 내부 영상까지 한눈에 확인하세요.",
    imageUrl: "/images/onboarding3.png",
    buttonText: "시작하기"
  },
];
// ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐


interface OnboardingProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0); 
  const currentSlide = onboardingSlides[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSlides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-gray-50">
      
      {/* 1. 이미지 및 내용 영역 */}
      <div className="flex-grow flex flex-col items-center justify-center text-center w-full">
        {/* 이미지 표시 영역 */}
        <div className="w-64 h-64 mb-8">
          <img 
              // public 폴더를 기준으로 경로 설정
              src={currentSlide.imageUrl} 
              alt={currentSlide.title} 
              className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {currentSlide.title}
        </h1>
        
        <p className="text-lg text-gray-600 px-4">
          {currentSlide.description}
        </p>
      </div>

      {/* 2. 네비게이션 및 버튼 영역 */}
      <div className="w-full max-w-sm">
        
        {/* 슬라이드 페이지 인디케이터 (하단 점 3개) */}
        <div className="flex justify-center space-x-2 mb-6">
          {onboardingSlides.map((_, index) => (
            <span
              key={index}
              className={`block w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-blue-600 w-6' : 'bg-gray-300'
              }`}
            ></span>
          ))}
        </div>

        {/* 버튼 */}
        <button
          onClick={handleNext}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          {currentSlide.buttonText}
        </button>
        
        {/* 건너뛰기 버튼 */}
        {currentStep < onboardingSlides.length - 1 && (
            <button 
                onClick={onComplete}
                className="w-full mt-3 py-2 text-gray-500 font-medium hover:text-gray-700 transition duration-300"
            >
                건너뛰기
            </button>
        )}
      </div>
    </div>
  );
}