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
    { href: '/', label: '대시보드', icon: '📊', ariaLabel: '대시보드 페이지로 이동' },
    { href: '/checklist', label: '체크리스트', icon: '✅', ariaLabel: '일일 웰니스 체크리스트 페이지로 이동' },
    { href: '/health', label: '건강 데이터', icon: '💪', ariaLabel: '건강 데이터 관리 페이지로 이동' },
    { href: '/ai', label: 'AI 추천', icon: '🤖', ariaLabel: 'AI 건강 추천 페이지로 이동' },
    { href: '/community', label: '커뮤니티', icon: '👥', ariaLabel: '커뮤니티 페이지로 이동' },
    { href: '/profile', label: '프로필', icon: '👤', ariaLabel: '사용자 프로필 페이지로 이동' }
  ]

  if (variant === 'header') {
    return (
      <header className="bg-gradient-to-r from-wellness-blue to-wellness-green text-white" role="banner">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/"
                className="text-3xl font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-wellness-blue rounded"
                aria-label="센테니얼 라이프 홈으로 이동"
              >
                센테니얼 라이프
              </Link>
              <p className="text-blue-100 mt-1" aria-live="polite">
                안녕하세요, {user?.user_metadata?.name || user?.email}님! 💪
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6 text-sm" aria-label="주요 메뉴">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.ariaLabel}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1 ${
                      pathname === item.href ? 'text-white font-medium' : 'text-blue-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <button
                onClick={signOut}
                aria-label="로그아웃"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-wellness-blue"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b" aria-label="주요 네비게이션">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={`flex items-center space-x-2 py-4 px-2 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:ring-offset-2 rounded ${
                pathname === item.href
                  ? 'border-b-2 border-wellness-blue text-wellness-blue font-medium'
                  : 'text-gray-600 hover:text-wellness-blue'
              }`}
            >
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
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