'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HERO_SLIDES, CTA_BUTTONS } from '@/constants/landingData';

interface HeroSliderProps {
  onLoginClick: () => void;
  onFeaturesClick: () => void;
}

export default function HeroSlider({ onLoginClick, onFeaturesClick }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 배경 이미지 */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          </div>

          {/* 콘텐츠 */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-6xl mx-auto px-4 text-center text-white">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                {slide.title}
              </h2>
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-yellow-300">
                {slide.subtitle}
              </h3>
              <p className="text-lg md:text-xl lg:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-gray-100">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onLoginClick}
                  className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {CTA_BUTTONS.primary.text}
                </button>
                <button
                  onClick={onFeaturesClick}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  {CTA_BUTTONS.secondary.text}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 슬라이드 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 네비게이션 화살표 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 스크롤 다운 힌트 */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <button
          onClick={onFeaturesClick}
          className="text-white hover:text-yellow-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
} 