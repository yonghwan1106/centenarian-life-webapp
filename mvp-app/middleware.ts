import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limit 저장소 (프로덕션에서는 Redis 등 사용 권장)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limit 설정
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1분
  maxRequests: 100, // 분당 최대 100 요청
}

/**
 * Rate Limiting 체크
 * @param identifier - IP 주소 또는 사용자 식별자
 * @returns true면 rate limit 초과
 */
function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(identifier)

  if (limit) {
    // 시간 윈도우가 지났으면 리셋
    if (now > limit.resetTime) {
      rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + RATE_LIMIT_CONFIG.windowMs,
      })
      return false
    }

    // 요청 횟수 증가
    if (limit.count >= RATE_LIMIT_CONFIG.maxRequests) {
      return true // Rate limit 초과
    }

    limit.count++
    return false
  }

  // 첫 요청
  rateLimitMap.set(identifier, {
    count: 1,
    resetTime: now + RATE_LIMIT_CONFIG.windowMs,
  })
  return false
}

/**
 * 주기적으로 만료된 엔트리 정리 (메모리 누수 방지)
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, RATE_LIMIT_CONFIG.windowMs)

export function middleware(request: NextRequest) {
  // API 경로만 rate limiting 적용
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // IP 주소 가져오기 (Vercel에서는 x-real-ip 헤더 사용)
    const ip =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'anonymous'

    // Rate limit 체크
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({
          error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
          code: 'RATE_LIMIT_EXCEEDED',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000)),
          },
        }
      )
    }

    // Rate limit 헤더 추가
    const response = NextResponse.next()
    const limit = rateLimitMap.get(ip)
    if (limit) {
      response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_CONFIG.maxRequests))
      response.headers.set('X-RateLimit-Remaining', String(RATE_LIMIT_CONFIG.maxRequests - limit.count))
      response.headers.set('X-RateLimit-Reset', String(limit.resetTime))
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
