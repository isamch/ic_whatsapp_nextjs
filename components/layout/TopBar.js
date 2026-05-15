'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { BellIcon, ChevronDownIcon, LogOutIcon, UserIcon, SettingsIcon } from 'lucide-react'
import { useApp } from '@/context/AppContext'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/conversations': 'Conversations',
  '/contacts': 'Contact Management',
  '/templates': 'Message Templates',
  '/campaigns': 'Campaigns',
  '/notifications': 'Notifications',
  '/admin/users': 'User Management',
  '/admin/analytics': 'Platform Analytics',
  '/admin/notifications': 'Broadcast Notifications',
  '/settings': 'Account Settings',
}

export default function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, unreadNotifications } = useApp()
  const currentUser = user || { name: '', email: '', roles: [] }

  const unreadCount = unreadNotifications
  const pageTitle = pageTitles[pathname] || 'WhatsApp CRM'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>

      <div className="flex items-center space-x-6">
        <button
          onClick={() => router.push('/notifications')}
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <BellIcon className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-whatsapp/10 flex items-center justify-center border border-whatsapp/20 overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-whatsapp" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700 leading-none">{currentUser.name}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{currentUser.roles?.[0] || 'user'}</p>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                <button
                  onClick={() => { router.push('/settings'); setIsDropdownOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <SettingsIcon className="w-4 h-4 mr-2 text-gray-400" />
                  Settings
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  onClick={() => { logout(); router.push('/login') }}
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
