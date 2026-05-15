'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  SearchIcon, Loader2Icon, UserIcon, SmartphoneIcon, HashIcon, ChevronRightIcon, MailIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAlert } from '@/context/AlertContext'
import api from '@/lib/api'

export default function AdminWhatsAppContactsListPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { showAlert } = useAlert()
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/whatsapp-contacts')
      setUsers(res.data?.users || [])
    } catch {
      showAlert('Failed to load users list', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full flex flex-col bg-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <SmartphoneIcon className="w-6 h-6 text-indigo-600" />
          </div>
          User WhatsApp Syncs (Admin)
        </h1>
        <p className="text-sm text-gray-500 mt-1">Select a user to view their synced WhatsApp contacts.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <div className="relative w-96">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
          </div>
          <div className="text-sm text-gray-500">
             Total Users: <strong>{filtered.length}</strong>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2Icon className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
              <p>Fetching user sync status...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <UserIcon className="w-12 h-12 mb-3 opacity-20" />
              <p>No users found matching your search.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {['User Info', 'Synced Contacts', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => router.push(`/admin/wh-contacts/${user.id}`)}
                    className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mr-3 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                          {(user.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{user.name || '—'}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                             <MailIcon className="w-3 h-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                         <div className={`p-1.5 rounded-lg ${user.contactCount > 0 ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                            <HashIcon className="w-4 h-4" />
                         </div>
                         <span className="text-sm font-bold text-gray-700">{user.contactCount}</span>
                         <span className="text-xs text-gray-400">contacts</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       {user.contactCount > 0 ? (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                           Synced
                         </span>
                       ) : (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                           No Data
                         </span>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 transition-all group-hover:translate-x-1">
                        View Contacts <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  )
}
