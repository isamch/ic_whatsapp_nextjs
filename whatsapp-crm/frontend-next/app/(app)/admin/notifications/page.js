'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SendIcon, BellIcon, UsersIcon, Loader2Icon } from 'lucide-react'
import { useAlert } from '@/context/AlertContext'
import api from '@/lib/api'
import { getInbox } from '@/lib/notifications'
import { getUsers } from '@/lib/users'
import { validateSendNotification } from '@/lib/validations/notification/sendNotification.validation'

export default function AdminNotificationsPage() {
  const [users, setUsers]         = useState([])
  const [sent, setSent]           = useState([])
  const [recipient, setRecipient] = useState('all')
  const [subject, setSubject]     = useState('')
  const [body, setBody]           = useState('')
  const [sending, setSending]     = useState(false)
  const [loading, setLoading]     = useState(true)
  const [errors, setErrors]       = useState({})
  const { showAlert } = useAlert()

  useEffect(() => {
    Promise.all([
      getUsers(),
      api.get('/notifications/sent'),
    ]).then(([uRes, sRes]) => {
      setUsers(uRes.data?.users || [])
      setSent(sRes.data?.data || [])
    }).catch(() => showAlert('Failed to load data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleSend = async () => {
    const errs = validateSendNotification({ subject: subject.trim(), body: body.trim(), recipientId: recipient !== 'all' ? recipient : undefined })
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSending(true)
    try {
      const payload = {
        subject: subject.trim(),
        body: body.trim(),
        ...(recipient !== 'all' && { recipientId: recipient }),
      }
      const res = await api.post('/notifications', payload)
      setSent(prev => [res.data, ...prev])
      setSubject('')
      setBody('')
      setRecipient('all')
      showAlert('Notification sent', 'success')
    } catch (err) {
      showAlert(err.message || 'Failed to send', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Broadcast Notifications</h1>
          <p className="text-gray-500 mt-1">Send in-app alerts and updates to users.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Compose */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center">
              <BellIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="font-semibold text-gray-900">Compose Message</h2>
            </div>
            <div className="p-6 flex-1 flex flex-col space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <div className="relative">
                  <select value={recipient} onChange={e => setRecipient(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none bg-white appearance-none">
                    <option value="all">All Users (Broadcast)</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                  <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" value={subject} onChange={e => { setSubject(e.target.value); setErrors(p => ({ ...p, subject: '' })) }}
                  placeholder="e.g., Scheduled Maintenance Notice"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none ${errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                <textarea value={body} onChange={e => { setBody(e.target.value); setErrors(p => ({ ...p, body: '' })) }}
                  placeholder="Type your notification message here..."
                  className={`w-full flex-1 min-h-[150px] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none ${errors.body ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body}</p>}
              </div>
              <button disabled={!subject || !body || sending} onClick={handleSend}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer">
                {sending ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <SendIcon className="w-4 h-4 mr-2" />}
                Send Notification
              </button>
            </div>
          </div>

          {/* Sent History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Sent History</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                </div>
              ) : sent.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">No notifications sent yet</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {sent.map(notif => (
                    <div key={notif._id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">{notif.subject}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-blue-600 font-medium mb-2">
                        To: {notif.isBroadcast ? 'All Users' : notif.recipientId?.name || 'Specific User'}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{notif.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
