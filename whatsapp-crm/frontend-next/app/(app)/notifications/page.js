'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BellIcon, Trash2Icon, CheckIcon, Loader2Icon, SettingsIcon, 
  UserIcon, UsersIcon, ShieldAlertIcon, InfoIcon, 
  CheckCircleIcon, ZapIcon, MoreVerticalIcon 
} from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { useAlert } from '@/context/AlertContext'
import { useApp } from '@/context/AppContext'
import { getInbox, markAsRead, markAllAsRead, deleteNotif } from '@/lib/notifications'

const TYPE_CONFIG = {
  system: { icon: ZapIcon, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'System Alert' },
  alert: { icon: ShieldAlertIcon, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Urgent' },
  success: { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', label: 'Update' },
  private: { icon: InfoIcon, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Message' },
  broadcast: { icon: UsersIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', label: 'Announcement' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [expandedId, setExpandedId]       = useState(null)
  const { showAlert } = useAlert()
  const { setUnreadNotifications } = useApp()

  useEffect(() => {
    getInbox()
      .then(res => setNotifications(res.data?.notifications || []))
      .catch(() => showAlert('Failed to load notifications', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleExpand = async (notif) => {
    setExpandedId(expandedId === notif.id ? null : notif.id)
    if (!notif.isRead) {
      try {
        await markAsRead(notif.id)
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n))
        setUnreadNotifications(prev => Math.max(0, prev - 1))
      } catch {}
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    try {
      await deleteNotif(id)
      const wasUnread = notifications.find(n => n.id === id && !n.isRead)
      setNotifications(prev => prev.filter(n => n.id !== id))
      if (wasUnread) setUnreadNotifications(prev => Math.max(0, prev - 1))
      showAlert('Notification removed', 'success')
    } catch { showAlert('Failed to delete', 'error') }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadNotifications(0)
      showAlert('All notifications marked as read', 'success')
    } catch { showAlert('Failed to mark all as read', 'error') }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full overflow-y-auto custom-scrollbar bg-page">
      <div className="max-w-4xl w-full mx-auto">
        <PageHeader
          title="Notifications"
          description="Stay updated with system alerts and messages."
          action={
            notifications.length > 0 && (
              <button onClick={handleMarkAllRead} className="text-sm font-medium text-whatsapp hover:text-whatsapp-hover flex items-center transition-colors cursor-pointer bg-whatsapp/10 px-3 py-1.5 rounded-lg">
                <CheckIcon className="w-4 h-4 mr-1.5" /> Mark all as read
              </button>
            )
          }
        />

        <div className="space-y-3 mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
              <Loader2Icon className="w-8 h-8 animate-spin text-whatsapp mb-3" />
              <p className="text-sm text-gray-500">Checking for new updates...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 py-20">
              <EmptyState icon={BellIcon} title="All caught up!" description="You don't have any notifications right now." />
            </div>
          ) : (
            notifications.map(notif => {
              const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.private
              const Icon = config.icon
              const isExpanded = expandedId === notif.id

              return (
                <div key={notif.id} 
                  onClick={() => handleExpand(notif)}
                  className={`group relative bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                    !notif.isRead ? `border-l-4 border-l-${config.color.split('-')[1]}-500 shadow-sm` : 'border-gray-200 opacity-90'
                  } ${isExpanded ? 'shadow-md ring-1 ring-gray-100' : 'hover:border-gray-300'}`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-lg shrink-0 ${config.bg} ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-base truncate ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                              {notif.subject || 'Platform Update'}
                            </h3>
                            {!notif.isRead && (
                               <span className={`w-2 h-2 rounded-full bg-${config.color.split('-')[1]}-500 animate-pulse`} />
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                           <span className={`text-[10px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
                              {config.label}
                           </span>
                           <span className="text-gray-300">•</span>
                           <span className="text-[11px] text-gray-500">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        </div>

                        {isExpanded ? (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-4 text-sm text-gray-700 leading-relaxed bg-gray-50/80 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap"
                          >
                            {notif.message}
                          </motion.div>
                        ) : (
                          <p className="text-sm text-gray-500 line-clamp-1">{notif.message}</p>
                        )}
                      </div>

                      <button onClick={(e) => handleDelete(e, notif.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </motion.div>
  )
}
