'use client'

import { useAuth } from '@/components/AuthProvider'
import CommunityPosts from '@/components/CommunityPosts'
import CreatePostForm from '@/components/CreatePostForm'
import LoginForm from '@/components/LoginForm'
import { PageLayout } from '@/components/AppNavigation'
import { useState } from 'react'

export default function CommunityPage() {
  const { user, loading } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <PageLayout 
      title="커뮤니티" 
      description="다른 사용자들과 건강 경험을 나누고 서로 격려해보세요"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Create Post Form */}
        <div>
          <CreatePostForm onPostCreated={handlePostCreated} />
        </div>
        
        {/* Community Posts */}
        <div>
          <CommunityPosts key={refreshKey} />
        </div>
      </div>
    </PageLayout>
  )
}