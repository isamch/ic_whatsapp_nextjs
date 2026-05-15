'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export default function DashboardLayout({ children }) {
  const { isAuthenticated, authLoading } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [authLoading, isAuthenticated, router])

  if (authLoading) return null

  return (
    <div className="flex h-screen w-full bg-page overflow-hidden font-sans text-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative h-full custom-scrollbar">{children}</main>
      </div>
    </div>
  )
}
