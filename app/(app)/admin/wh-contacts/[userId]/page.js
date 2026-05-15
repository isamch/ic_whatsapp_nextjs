'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import {
  SearchIcon, Loader2Icon, UserIcon, SmartphoneIcon, HashIcon, ArrowLeftIcon, PhoneIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAlert } from '@/context/AlertContext'
import api from '@/lib/api'

export default function AdminUserWhatsAppContactsPage({ params }) {
  const { userId } = use(params)
  const [data, setData] = useState({ user: null, contacts: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { showAlert } = useAlert()
  const router = useRouter()

  useEffect(() => {
    if (userId) fetchUserContacts()
  }, [userId])

  const fetchUserContacts = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/admin/whatsapp-contacts/${userId}`)
      setData(res.data || { user: null, contacts: [] })
    } catch {
      showAlert('Failed to load user contacts', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filtered = (data.contacts || []).filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full flex flex-col bg-page">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {loading ? 'Loading...' : `${data.user?.name}'s WhatsApp Contacts`}
            </h1>
            {!loading && <p className="text-sm text-gray-500 mt-1">{data.user?.email}</p>}
          </div>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
           <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-600">
              <SmartphoneIcon className="w-4 h-4" />
           </div>
           <span className="text-sm font-bold text-gray-700">{data.contacts?.length || 0} Total Contacts</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <div className="relative w-96">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts for this user..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2Icon className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
              <p>Loading contacts...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <PhoneIcon className="w-12 h-12 mb-3 opacity-20" />
              <p>No contacts found for this user.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {['Contact Name', 'Phone Number', 'Sync Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium mr-3">
                          {(contact.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{contact.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{contact.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
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
