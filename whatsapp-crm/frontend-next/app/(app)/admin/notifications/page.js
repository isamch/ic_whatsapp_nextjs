'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SendIcon, BellIcon, UsersIcon, Loader2Icon, ShieldAlertIcon, 
  InfoIcon, CheckCircleIcon, ZapIcon 
} from 'lucide-react'
import { useAlert } from '@/context/AlertContext'
import api from '@/lib/api'
import { getUsers } from '@/lib/users'

const NOTIF_TYPES = [
  { id: 'system', label: 'System Alert', icon: ZapIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'alert', label: 'Urgent/Danger', icon: ShieldAlertIcon, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'success', label: 'Success/Update', icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'private', label: 'General Info', icon: InfoIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
]

export default function AdminNotificationsPage() {
  const [users, setUsers]         = useState([])
  const [sent, setSent]           = useState([])
  const [recipient, setRecipient] = useState('all')
  const [subject, setSubject]     = useState('')
  const [body, setBody]           = useState('')
  const [type, setType]           = useState('private')
  const [sending, setSending]     = useState(false)
  const [loading, setLoading]     = useState(true)
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
    if (!subject.trim() || !body.trim()) return showAlert('Subject and Message are required', 'error')
    
    setSending(true)
    try {
      const payload = {
        subject: subject.trim(),
        body: body.trim(),
        type,
        recipientId: recipient === 'all' ? null : recipient
      }
      const res = await api.post('/notifications', payload)
      setSent(prev => [res.data, ...prev])
      setSubject('')
      setBody('')
      setRecipient('all')
      showAlert('Notification sent successfully', 'success')
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to send', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Broadcast Notifications</h1>
            <p className="text-gray-500 mt-1">Send in-app alerts and official updates to your users.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Compose Form */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col sticky top-0">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center">
              <BellIcon className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="font-semibold text-gray-900">Compose Message</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Recipient</label>
                <div className="relative">
                  <select value={recipient} onChange={e => setRecipient(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none bg-white appearance-none text-sm">
                    <option value="all">Broadcast to All Users</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                  <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notification Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {NOTIF_TYPES.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={`flex items-center gap-2 p-2.5 border rounded-lg text-xs font-medium transition-all ${
                        type === t.id ? `${t.bg} border-${t.color.split('-')[1]}-200 ${t.color} ring-1 ring-${t.color.split('-')[1]}-200` : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="e.g., Update Available"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message Content</label>
                <textarea value={body} onChange={e => setBody(e.target.value)}
                  placeholder="What would you like to say?"
                  className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none text-sm" />
              </div>

              <button disabled={sending} onClick={handleSend}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50 shadow-sm">
                {sending ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <SendIcon className="w-4 h-4 mr-2" />}
                Dispatch Notification
              </button>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recently Sent</h2>
              <span className="text-xs text-gray-500">{sent.length} items</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-100">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2Icon className="w-6 h-6 animate-spin text-gray-300" />
                </div>
              ) : sent.length === 0 ? (
                <div className="py-20 text-center text-sm text-gray-400 italic">No notification history yet</div>
              ) : (
                sent.map(notif => {
                  const t = NOTIF_TYPES.find(x => x.id === notif.type) || NOTIF_TYPES[3]
                  return (
                    <div key={notif.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <div className={`p-1.5 rounded-md ${t.bg}`}>
                              <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                           </div>
                           <h3 className="font-semibold text-gray-900 text-sm">{notif.subject}</h3>
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-1 rounded">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                         <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">To:</span>
                         <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 border border-gray-200 rounded">
                            {notif.type === 'broadcast' ? 'Everyone' : 'Single User'}
                         </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
