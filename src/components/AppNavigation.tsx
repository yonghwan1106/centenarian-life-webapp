'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'

interface NavigationProps {
  variant?: 'header' | 'tabs'
}

export default function AppNavigation({ variant = 'tabs' }: NavigationProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navItems = [
    { href: '/', label: '대시보드', icon: '📊' },
    { href: '/health', label: '건강 데이터', icon: '💪' },
    { href: '/ai', label: 'AI 추천', icon: '🤖' },
    { href: '/community', label: '커뮤니티', icon: '👥' },
    { href: '/profile', label: '프로필', icon: '👤' }
  ]

  if (variant === 'header') {
    return (
      <div className="bg-gradient-to-r from-wellness-blue to-wellness-green text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-3xl font-bold hover:opacity-90 transition-opacity">
                센테니얼 라이프
              </Link>
              <p className="text-blue-100 mt-1">
                안녕하세요, {user?.user_metadata?.name || user?.email}님! 💪
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`hover:text-blue-200 transition-colors ${
                      pathname === item.href ? 'text-white font-medium' : 'text-blue-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <button
                onClick={signOut}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 py-4 px-2 whitespace-nowrap transition-colors ${
                pathname === item.href
                  ? 'border-b-2 border-wellness-blue text-wellness-blue font-medium'
                  : 'text-gray-600 hover:text-wellness-blue'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// 페이지 레이아웃용 컴포넌트
interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation variant="header" />
      <AppNavigation variant="tabs" />
      
      <div className="container mx-auto px-4 py-8">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            )}
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}