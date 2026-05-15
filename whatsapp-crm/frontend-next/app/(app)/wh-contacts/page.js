'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  SearchIcon, Loader2Icon, UserIcon, PhoneIcon, HashIcon, RefreshCwIcon
} from 'lucide-react'
import { Badge } from '@/components/ui'
import { useAlert } from '@/context/AlertContext'
import WhatsAppRequired from '@/components/WhatsAppRequired'
import api from '@/lib/api'

export default function WhatsAppContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [search, setSearch] = useState('')
  const { showAlert } = useAlert()

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/whatsapp/contacts')
      const data = res.data?.contacts || []
      setContacts(data)
      return data
    } catch {
      showAlert('Failed to load WhatsApp contacts', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts().then(data => {
      // Auto sync if list is empty
      if (data && data.length === 0) {
        handleSync()
      }
    })
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await api.post('/whatsapp/sync')
      showAlert(res.data?.message || 'Sync completed', 'success')
      fetchContacts()
    } catch (err) {
      showAlert(err.response?.data?.message || 'Sync failed', 'error')
    } finally {
      setSyncing(false)
    }
  }

  const filtered = contacts.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  )

  return (
    <WhatsAppRequired>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full flex flex-col bg-page">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-whatsapp/10 rounded-lg">
                <PhoneIcon className="w-6 h-6 text-whatsapp" />
              </div>
              WhatsApp Contacts
            </h1>
            <p className="text-sm text-gray-500 mt-1">Viewing all {contacts.length} contacts saved in your private table.</p>
          </div>
          
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center px-4 py-2 bg-whatsapp text-white rounded-lg text-sm font-medium hover:bg-whatsapp-hover transition-all shadow-sm disabled:opacity-50"
          >
            {syncing ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCwIcon className="w-4 h-4 mr-2" />}
            Sync from Device
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <div className="relative w-80">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search WhatsApp contacts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
               <div className="flex items-center gap-1.5">
                  <HashIcon className="w-4 h-4" />
                  <span>Total: <strong>{filtered.length}</strong></span>
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Loader2Icon className="w-8 h-8 animate-spin mb-3 text-whatsapp" />
                <p>Loading your private contacts...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <UserIcon className="w-12 h-12 mb-3 opacity-20" />
                <p>No contacts found. Use the sync button to import them.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {['Name', 'Phone', 'Sync Date'].map(h => (
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
    </WhatsAppRequired>
  )
}
