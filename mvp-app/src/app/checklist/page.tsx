'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import LoginForm from '@/components/LoginForm'
import { PageLayout } from '@/components/AppNavigation'
import DailyWellnessChecklist from '@/components/DailyWellnessChecklist'

export default function ChecklistPage() {
  const { user, loading } = useAuth()

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
      title="일일 웰니스 체크리스트" 
      description="오늘의 웰니스 목표를 체크하고 건강한 하루를 만들어보세요"
    >
      <DailyWellnessChecklist />
    </PageLayout>
  )
}