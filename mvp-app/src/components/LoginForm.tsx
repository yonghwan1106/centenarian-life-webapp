'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'

export default function LoginForm() {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = isSignUp 
        ? await signUp(email, password, name)
        : await signIn(email, password)

      if (result.error) {
        // 에러 메시지를 더 사용자 친화적으로 변경
        if (result.error.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else if (result.error.message.includes('Email not confirmed')) {
          setError('이메일 인증이 필요합니다. 받은편지함에서 인증 이메일을 확인해주세요.')
        } else if (result.error.message.includes('invalid') && result.error.message.includes('Email')) {
          setError('유효하지 않은 이메일 주소입니다. Gmail, Outlook 등 실제 이메일 주소를 사용해주세요.')
        } else {
          setError(result.error.message)
        }
      } else if (isSignUp && result.user) {
        // 회원가입 성공 메시지
        if (result.session) {
          // 즉시 로그인됨
          setSuccess('회원가입이 완료되었습니다! 자동으로 로그인됩니다.')
        } else {
          // 이메일 인증 필요
          setSuccess('회원가입이 완료되었습니다! 이메일을 확인하여 인증을 완료해주세요.')
        }
        // 폼 초기화
        setEmail('')
        setPassword('')
        setName('')
        setIsSignUp(false)
      }
    } catch (err) {
      setError('예상치 못한 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wellness-blue to-wellness-green">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              센테니얼 라이프
            </h1>
            <p className="text-gray-600 mt-2">
              {isSignUp ? '새 계정 만들기' : '로그인'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
                  placeholder="홍길동"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
                placeholder="••••••••"
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded p-3">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded p-3">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wellness-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wellness-blue disabled:opacity-50"
            >
              {loading ? '처리 중...' : (isSignUp ? '가입하기' : '로그인')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-wellness-blue hover:text-blue-700 text-sm"
            >
              {isSignUp 
                ? '이미 계정이 있으신가요? 로그인' 
                : '계정이 없으신가요? 가입하기'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}