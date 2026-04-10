'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BellIcon, Trash2Icon, CheckIcon, Loader2Icon, SettingsIcon, UserIcon, UsersIcon } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { useAlert } from '@/context/AlertContext'
import { useApp } from '@/context/AppContext'
import { getInbox, markAsRead, markAllAsRead, deleteNotif } from '@/lib/notifications'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [expandedId, setExpandedId]       = useState(null)
  const { showAlert } = useAlert()
  const { setUnreadNotifications } = useApp()

  useEffect(() => {
    getInbox()
      .then(res => setNotifications(res.data?.data || []))
      .catch(() => showAlert('Failed to load notifications', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleExpand = async (notif) => {
    setExpandedId(expandedId === notif._id ? null : notif._id)
    if (!notif.isRead) {
      try {
        await markAsRead(notif._id)
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n))
        setUnreadNotifications(prev => Math.max(0, prev - 1))
      } catch {}
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    try {
      await deleteNotif(id)
      const wasUnread = notifications.find(n => n._id === id && !n.isRead)
      setNotifications(prev => prev.filter(n => n._id !== id))
      if (wasUnread) setUnreadNotifications(prev => Math.max(0, prev - 1))
    } catch { showAlert('Failed to delete', 'error') }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadNotifications(0)
    } catch { showAlert('Failed to mark all as read', 'error') }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl w-full mx-auto">
        <PageHeader
          title="Notifications"
          description="Updates and alerts from the platform."
          action={
            <button onClick={handleMarkAllRead} className="text-sm font-medium text-whatsapp hover:text-whatsapp-hover flex items-center transition-colors cursor-pointer">
              <CheckIcon className="w-4 h-4 mr-1" /> Mark all as read
            </button>
          }
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState icon={BellIcon} title="All caught up!" description="You don't have any notifications right now." />
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map(notif => (
                <div key={notif._id}
                  className={`p-5 cursor-pointer transition-colors hover:bg-gray-50 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                  onClick={() => handleExpand(notif)}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start flex-1">
                      <div className="mt-1 mr-4">
                        {!notif.isRead
                          ? <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" />
                          : <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className={`text-base ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {notif.subject}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                          {notif.isSystem
                            ? <SettingsIcon className="w-3 h-3 text-gray-400" />
                            : notif.isBroadcast
                            ? <UsersIcon className="w-3 h-3 text-gray-400" />
                            : <UserIcon className="w-3 h-3 text-gray-400" />}
                          <span>{notif.isSystem ? 'System' : notif.isBroadcast ? 'Broadcast' : `From: ${notif.senderId?.name || 'Admin'}`}</span>
                        </p>
                        {expandedId === notif._id ? (
                          <div className="mt-3 text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {notif.body}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">{notif.body}</p>
                        )}
                      </div>
                    </div>
                    <button onClick={(e) => handleDelete(e, notif._id)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
