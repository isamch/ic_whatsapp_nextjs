'use client'

import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'



export default function AuthLayout({ children }) {

  const { isAuthenticated } = useApp()

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard')
  }, [isAuthenticated, router]);


  return (
    <div className="min-h-screen bg-page font-sans">
      {children}
    </div>
  )
}
