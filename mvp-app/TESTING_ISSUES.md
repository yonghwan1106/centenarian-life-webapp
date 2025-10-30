# 배포 테스트 이슈 및 해결 방안

## 테스트 일시
2025-10-30

## 배포 URL
https://centenarian-life-webapp-3rya.vercel.app/

## 발견된 주요 이슈

### 1. 이메일 인증 문제 ⚠️ (Critical)

**증상**:
- 회원가입 후 이메일 인증이 필요하다는 메시지가 표시됨
- 로그인 시도 시 "이메일 인증이 필요합니다. 이메일을 확인해주세요." 오류 발생
- 테스트 계정 생성이 불가능하여 앱 기능 테스트 불가

**재현 단계**:
1. 회원가입 페이지에서 이메일과 비밀번호 입력
2. "가입하기" 버튼 클릭
3. "회원가입이 완료되었습니다! 이메일을 확인하여 인증을 완료해주세요." 메시지 표시
4. 로그인 시도 시 "이메일 인증이 필요합니다" 오류

**원인**:
- Supabase 프로젝트 설정에서 "Confirm email" 옵션이 활성화되어 있음
- 이메일 확인 없이는 로그인이 불가능한 상태

**해결 방법 (옵션 A - 권장)**: Supabase 대시보드에서 이메일 확인 비활성화

1. Supabase 대시보드 접속: https://supabase.com/dashboard
2. 프로젝트 선택 (gqxpabnsdpnrztzpdudi)
3. Authentication → Settings 이동
4. "Auth Settings" 섹션에서 "Enable email confirmations" 옵션 찾기
5. 옵션을 비활성화 (OFF)로 변경
6. "Save" 클릭

**해결 방법 (옵션 B)**: Admin API로 테스트 계정 생성

```javascript
// scripts/create-verified-user.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createVerifiedUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'testuser@example.com',
    password: 'testpass123',
    email_confirm: true, // 이메일 확인됨으로 표시
    user_metadata: {
      full_name: '테스트유저'
    }
  })

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('✅ User created successfully!')
    console.log('Email:', 'testuser@example.com')
    console.log('Password:', 'testpass123')
  }
}

createVerifiedUser()
```

실행: `node scripts/create-verified-user.js`

**해결 방법 (옵션 C)**: 프로덕션 전용 이메일 확인 기능

`src/lib/auth.ts` 수정:
```typescript
async signUp(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || '',
      },
      // 프로덕션에서만 이메일 확인 요구
      emailRedirectTo: process.env.NODE_ENV === 'production'
        ? `${window.location.origin}/auth/callback`
        : undefined
    }
  })

  return { user: data.user, session: data.session, error }
}
```

**우선순위**: High
**영향**: 앱 전체 기능 테스트 불가

---

### 2. 이메일 형식 검증 이슈 ⚠️

**증상**:
- 특정 이메일 도메인(@test.com 등)이 "Email address is invalid" 오류 발생
- Gmail, Outlook 등 주요 도메인만 허용되는 것으로 보임

**재현 단계**:
1. 회원가입 페이지에서 "localtest@test.com" 입력
2. "가입하기" 클릭
3. "Email address 'localtest@test.com' is invalid" 오류 표시

**원인**:
- Supabase 또는 이메일 서비스 제공자의 이메일 검증 정책
- 테스트 도메인이 실제로 존재하지 않아 거부됨

**해결 방법**:
- 테스트 시 실제 존재하는 도메인 사용 (gmail.com, outlook.com 등)
- 개발 환경에서는 Mailtrap, MailHog 같은 테스트 이메일 서비스 사용

**우선순위**: Medium
**영향**: 테스트 시 불편함

---

## 기타 확인사항

### ✅ 정상 작동 확인된 부분
1. 랜딩 페이지 로드 및 UI
2. 로그인/회원가입 모달 UI
3. 폼 입력 및 검증
4. 에러 메시지 표시
5. 로컬 개발 서버 실행

### 🔍 테스트 필요 (인증 후)
1. 건강 데이터 입력 및 저장
2. 대시보드 차트 및 통계
3. AI 추천 기능
4. 커뮤니티 기능 (게시글, 댓글)
5. 프로필 관리
6. 체크리스트 기능

---

## 권장 조치사항

### 즉시 조치
1. **Supabase 이메일 확인 설정 변경** (가장 중요)
   - Supabase 대시보드에서 "Enable email confirmations" 비활성화
   - 또는 개발 환경에서만 비활성화하고 프로덕션에서는 활성화

2. **테스트 계정 생성**
   - Admin API로 이메일이 확인된 테스트 계정 생성
   - 테스트 자동화를 위한 시드 데이터 준비

### 중기 조치
1. **이메일 확인 프로세스 개선**
   - 이메일 확인 링크 템플릿 커스터마이징
   - 확인 완료 후 리다이렉션 페이지 제작
   - 이메일 재전송 기능 추가

2. **테스트 환경 구축**
   - E2E 테스트 자동화 (Playwright)
   - 테스트 데이터 시딩 스크립트
   - CI/CD 파이프라인에 테스트 통합

---

## 참고 링크
- Supabase Auth 문서: https://supabase.com/docs/guides/auth
- Supabase Email 설정: https://supabase.com/docs/guides/auth/auth-email
