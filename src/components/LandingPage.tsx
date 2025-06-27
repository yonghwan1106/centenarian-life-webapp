'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    const LoginForm = require('./LoginForm').default
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌟</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                센테니얼 라이프
              </h1>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-wellness-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              로그인 / 회원가입
            </button>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            건강한 <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">100세</span>를 위한
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-700 mb-8">
            AI 웰니스 동반자
          </h3>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            인공지능이 분석한 맞춤형 건강 조언과 체계적인 데이터 관리로 
            여러분의 건강한 100세 인생을 함께 만들어갑니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-wellness-blue text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              무료로 시작하기 🚀
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-wellness-blue text-wellness-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              기능 살펴보기
            </button>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            🎯 주요 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">종합 건강 추적</h3>
              <p className="text-gray-600 mb-4">
                심박수, 혈압, 체중, 걸음수, 수면, 기분까지 
                모든 건강 지표를 체계적으로 관리하세요.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>✓ 실시간 데이터 입력</li>
                <li>✓ 인터랙티브 차트</li>
                <li>✓ 추세 분석</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">AI 맞춤 조언</h3>
              <p className="text-gray-600 mb-4">
                OpenAI GPT-4가 분석한 개인화된 건강 추천으로 
                더 나은 라이프스타일을 만들어보세요.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>✓ 운동 추천</li>
                <li>✓ 영양 가이드</li>
                <li>✓ 수면 개선 팁</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">커뮤니티</h3>
              <p className="text-gray-600 mb-4">
                같은 목표를 가진 사람들과 경험을 나누고 
                서로 동기부여하며 함께 성장하세요.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>✓ 경험 공유</li>
                <li>✓ 실시간 댓글</li>
                <li>✓ 좋아요 시스템</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 대시보드 미리보기 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            📱 스마트 대시보드
          </h2>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6">
              <div className="flex items-center justify-between text-white">
                <h3 className="text-xl font-semibold">건강 대시보드</h3>
                <div className="text-sm opacity-90">최근 30일</div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">평균 심박수</p>
                      <p className="text-2xl font-bold text-blue-600">72 BPM</p>
                    </div>
                    <div className="text-3xl">❤️</div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">평균 수면</p>
                      <p className="text-2xl font-bold text-green-600">7.2시간</p>
                    </div>
                    <div className="text-3xl">😴</div>
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">일일 걸음수</p>
                      <p className="text-2xl font-bold text-purple-600">8,500</p>
                    </div>
                    <div className="text-3xl">🚶</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 mb-4">실제 차트와 더 많은 기능을 경험해보세요!</p>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-wellness-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  지금 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            onClick={() => setShowLogin(true)}
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