'use client';

import { useState, useEffect, useContext } from 'react';
import { HideNavContext } from "../../app/clientlayout";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const onboardingSlides = [
  {
    id: 1,
    subTitle: "SMART BALANCING",
    title: "흔들리는 오토바이,\n음식은 편안하게",
    description: "방지턱을 넘어도, 급커브를 돌아도\n수평 유지 기술이 국물 한 방울 지켜냅니다.",
    imageUrl: "/images/onboarding1.png", 
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: 2,
    subTitle: "REAL-TIME SENSING",
    title: "가장 맛있는 온도,\n그대로 식탁까지",
    description: "식어서 오는 배달은 이제 그만.\n온습도 센서가 최적의 환경을 감시합니다.",
    imageUrl: "/images/onboarding2.png", 
    color: "from-indigo-600 to-purple-600"
  },
  {
    id: 3,
    subTitle: "LIVE MONITORING",
    title: "내 음식의 여정,\n눈으로 확인하세요",
    description: "배달통 내부 영상과 센서 데이터를\n실시간으로 투명하게 보여드릴게요.",
    imageUrl: "/images/onboarding3.png", 
    color: "from-blue-500 to-cyan-500"
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const currentSlide = onboardingSlides[currentStep];
  const { setHideNav } = useContext(HideNavContext);

  useEffect(() => {
    setHideNav(true);
    return () => setHideNav(false);
  }, [setHideNav]);

  const handleNext = () => {
    if (currentStep < onboardingSlides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-white flex flex-col">
      
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[20%] w-[500px] h-[500px] bg-blue-100/70 rounded-full blur-[100px]"
        />
        <motion.div 
           animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[20%] w-[400px] h-[400px] bg-indigo-100/60 rounded-full blur-[80px]"
        />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      {/* 건너뛰기 버튼 */}
      {currentStep < onboardingSlides.length - 1 && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute top-0 right-0 p-6 z-20 pt-[calc(env(safe-area-inset-top)+20px)]"
        >
          <button 
            onClick={onComplete}
            className="text-sm text-gray-400 font-semibold hover:text-gray-600 transition-colors bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100"
          >
            Skip
          </button>
        </motion.div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* 이미지 영역 */}
            <div className="relative w-full max-w-[320px] aspect-square mb-10 flex items-center justify-center rounded-3xl overflow-hidden bg-white/30 backdrop-blur-sm shadow-xl border border-white/50 p-4">
              <div className={`absolute inset-4 bg-gradient-to-tr ${currentSlide.color} opacity-30 blur-2xl rounded-full`} />
              <img 
                src={currentSlide.imageUrl} 
                alt="Onboarding" 
                className="relative w-full h-full object-contain z-10 rounded-2xl"
                onError={(e) => e.currentTarget.style.display = 'none'} 
              />
            </div>

            {/* 텍스트 영역 */}
            <div className="w-full text-left space-y-3">
              {/* ✅ 여기서 색상을 3번째 페이지 색(Blue-Cyan)으로 고정했습니다! */}
              <p className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                {currentSlide.subTitle}
              </p>

              <h1 className="text-4xl font-extrabold text-gray-900 leading-[1.2] whitespace-pre-line tracking-tight">
                {currentSlide.title}
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-line pt-2">
                {currentSlide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 컨트롤 영역 */}
      <div className="w-full px-6 pb-[calc(env(safe-area-inset-bottom)+30px)] z-20">
        <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              {onboardingSlides.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentStep ? "w-8 bg-gray-900" : "w-2 bg-gray-300"}`} 
                />
              ))}
            </div>

            <motion.button
              onClick={handleNext}
              whileTap={{ scale: 0.9 }}
              className={`
                w-16 h-16 rounded-full 
                flex items-center justify-center
                text-white
                bg-gradient-to-br from-gray-700 via-gray-900 to-black
                border border-white/10
                shadow-2xl shadow-gray-400/50
                transition-all duration-500
              `}
            >
              <ChevronRight size={32} strokeWidth={3} />
            </motion.button>
        </div>
      </div>
    </div> 
  );
}