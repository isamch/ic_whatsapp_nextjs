'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboardIcon, MessageSquareIcon, UsersIcon, BookOpenIcon,
  SendIcon, BellIcon, SettingsIcon, ShieldIcon,
  SmartphoneIcon, WifiIcon, WifiOffIcon,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, href: '/dashboard' },
  { id: 'conversations', label: 'Conversations', icon: MessageSquareIcon, href: '/conversations' },
  { id: 'contacts', label: 'Contacts', icon: UsersIcon, href: '/contacts' },
  { id: 'templates', label: 'Templates', icon: BookOpenIcon, href: '/templates' },
  { id: 'campaigns', label: 'Campaigns', icon: SendIcon, href: '/campaigns' },
  { id: 'notifications', label: 'Notifications', icon: BellIcon, href: '/notifications' },
]

const adminItems = [
  { id: 'admin-users', label: 'Users', icon: ShieldIcon, href: '/admin/users' },
  { id: 'admin-notifications', label: 'Send Notification', icon: BellIcon, href: '/admin/notifications' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, sessionStatus, unreadConversations, unreadNotifications } = useApp()
  const currentUser = user || { name: '', email: '', roles: [] }

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const renderNavItem = (item) => {
    const active = isActive(item.href)
    const Icon = item.icon
    const badge = item.href === '/conversations' ? unreadConversations : item.href === '/notifications' ? unreadNotifications : 0

    return (
      <button
        key={item.id}
        onClick={() => router.push(item.href)}
        className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors ${active ? 'bg-sidebar-active text-white border-l-4 border-whatsapp' : 'text-gray-400 hover:bg-sidebar-hover hover:text-gray-200 border-l-4 border-transparent'}`}
      >
        <div className="flex items-center">
          <Icon className={`w-5 h-5 mr-3 ${active ? 'text-whatsapp' : ''}`} />
          <span className="font-medium text-sm">{item.label}</span>
        </div>
        {badge > 0 && (
          <span className="bg-whatsapp text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="w-64 bg-sidebar h-screen flex flex-col flex-shrink-0 text-white shadow-xl z-20 relative">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="w-8 h-8 bg-whatsapp rounded-lg flex items-center justify-center mr-3">
          <MessageSquareIcon className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">WhatsApp CRM</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <div className="space-y-1">{navItems.map(renderNavItem)}</div>
        {currentUser.roles?.includes('admin') && (
          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Administration
            </h3>
            <div className="space-y-1">{adminItems.map(renderNavItem)}</div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => router.push('/settings')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/settings') ? 'bg-sidebar-active text-white border-l-4 border-whatsapp' : 'text-gray-400 hover:bg-sidebar-hover hover:text-gray-200 border-l-4 border-transparent'}`}
        >
          <SettingsIcon className={`w-5 h-5 mr-3 ${isActive('/settings') ? 'text-whatsapp' : ''}`} />
          <span className="font-medium text-sm">Settings</span>
        </button>

        <div className="mt-4 px-4 py-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <SmartphoneIcon className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-xs text-gray-300">WhatsApp</span>
          </div>
          <div className="flex items-center">
            {sessionStatus === 'connected' ? (
              <>
                <WifiIcon className="w-3 h-3 text-whatsapp mr-1.5" />
                <span className="text-xs font-medium text-whatsapp">Connected</span>
              </>
            ) : (
              <>
                <WifiOffIcon className="w-3 h-3 text-red-500 mr-1.5" />
                <span className="text-xs font-medium text-red-500">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
