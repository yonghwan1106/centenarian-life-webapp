'use client'

import { useState } from 'react'
import LandingHeader from './ui/LandingHeader'
import HeroSlider from './ui/HeroSlider'
import FeaturesSection from './ui/FeaturesSection'
import DashboardPreview from './ui/DashboardPreview'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)

  const handleLoginClick = () => {
    setShowLogin(true)
  }

  const handleFeaturesClick = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (showLogin) {
    const LoginForm = require('./LoginForm').default
    return <LoginForm />
  }

  return (
    <div className="min-h-screen">
      <LandingHeader onLoginClick={handleLoginClick} />
      <HeroSlider 
        onLoginClick={handleLoginClick} 
        onFeaturesClick={handleFeaturesClick}
      />
      <FeaturesSection />
      <DashboardPreview />
      
      {/* AI 추천 미리보기 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            🧠 AI 건강 인사이트 맛보기
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💪 운동 추천</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-medium text-blue-700">주 3회 유산소 운동</p>
                  <p className="text-sm text-gray-600">심박수 데이터를 기반으로 30분 빠른 걷기를 추천드립니다.</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-medium text-green-700">근력 운동 추가</p>
                  <p className="text-sm text-gray-600">체중 변화 패턴을 보면 주 2회 근력 운동이 도움될 것 같습니다.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">😴 수면 개선</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-medium text-purple-700">수면 시간 일정하게</p>
                  <p className="text-sm text-gray-600">최근 수면 패턴이 불규칙합니다. 매일 같은 시간에 잠들어보세요.</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-medium text-pink-700">기분과 수면의 연관성</p>
                  <p className="text-sm text-gray-600">충분한 수면을 취한 날 기분 점수가 더 높았습니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 건강한 100세 여정을 시작하세요! 🌟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            무료 회원가입하고 AI 맞춤 건강 조언을 받아보세요
          </p>
          <button
            onClick={handleLoginClick}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            무료로 시작하기 🚀
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl">🌟</div>
                <h3 className="text-xl font-bold">센테니얼 라이프</h3>
              </div>
              <p className="text-gray-400">
                AI 기반 웰니스 동반자로 건강한 100세를 만들어갑니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">주요 기능</h4>
              <ul className="space-y-2 text-gray-400">
                <li>건강 데이터 추적</li>
                <li>AI 맞춤 조언</li>
                <li>커뮤니티 소통</li>
                <li>대시보드 분석</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">기술 스택</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Next.js & React</li>
                <li>OpenAI GPT-4</li>
                <li>Supabase</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 센테니얼 라이프. Made with ❤️ by Claude AI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}