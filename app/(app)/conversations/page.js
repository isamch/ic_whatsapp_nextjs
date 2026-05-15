'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  SearchIcon, CheckCheckIcon, SmileIcon, SendIcon,
  MoreVerticalIcon, PhoneIcon, VideoIcon, MessageSquareIcon, Loader2Icon, XIcon,
} from 'lucide-react'
import { getContactConversations, getMessages, sendMessage } from '@/lib/conversations'
import { useAlert } from '@/context/AlertContext'
import { useApp } from '@/context/AppContext'
import WhatsAppRequired from '@/components/WhatsAppRequired'

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const messagesEndRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const { showAlert } = useAlert()
  const { sessionStatus } = useApp()

  const fetchContacts = useCallback(async (pageNum = 1, search = '') => {
    if (pageNum === 1) setLoadingConvs(true)
    else setLoadingMore(true)
    
    try {
      const res = await getContactConversations({ page: pageNum, search })
      const newConvs = res.data?.contacts || []
      
      if (pageNum === 1) {
        setConversations(newConvs)
      } else {
        setConversations(prev => [...prev, ...newConvs])
      }
      
      setHasMore(newConvs.length === 30) // limit is 30
      setPage(pageNum)
    } catch {
      showAlert('Failed to load contacts', 'error')
    } finally {
      setLoadingConvs(false)
      setLoadingMore(false)
    }
  }, [showAlert])

  useEffect(() => {
    if (sessionStatus === 'connected') {
      fetchContacts(1, searchQuery)
    } else {
      setLoadingConvs(false)
    }
  }, [sessionStatus, fetchContacts])

  const handleSearch = (val) => {
    setSearchQuery(val)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      fetchContacts(1, val)
    }, 500)
  }

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    fetchContacts(page + 1, searchQuery)
  }

  const loadMessages = useCallback(async (conv) => {
    setLoadingMsgs(true)
    setMessages([])
    try {
      const res = await getMessages(conv.id)
      setMessages(res.data?.data || [])
    } catch {
      showAlert('Failed to load messages', 'error')
    } finally {
      setLoadingMsgs(false)
    }
  }, [showAlert])

  const handleSelectConv = useCallback((conv) => {
    setSelectedConv(conv)
    loadMessages(conv)
  }, [loadMessages])

  useEffect(() => {
    if (!loadingMsgs) {
      const frame = requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [loadingMsgs, selectedConv])

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedConv || sending) return
    const text = messageInput.trim()
    const tempId = `temp_${Date.now()}`
    setMessageInput('')
    setSending(true)
    setMessages(prev => [...prev, { id: tempId, body: text, fromMe: true, timestamp: new Date().toISOString() }])
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    try {
      await sendMessage(selectedConv.id, text)
    } catch {
      showAlert('Failed to send message', 'error')
      setMessages(prev => prev.filter(m => m.id !== tempId))
    } finally {
      setSending(false)
    }
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getInitial = (name) => (name || '?').charAt(0).toUpperCase()

  return (
    <WhatsAppRequired>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex bg-white">

      {/* Sidebar - Contacts List */}
      <div className="w-[350px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white z-10">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Conversations</h2>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp transition-shadow"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loadingConvs ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <MessageSquareIcon className="w-10 h-10 mb-2 text-gray-300" />
              <p className="text-sm">No contacts found</p>
            </div>
          ) : (
            <>
              {conversations.map((conv) => {
                const isSelected = selectedConv?.id === conv.id
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv)}
                    className={`w-full flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${isSelected ? 'bg-green-50' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg mr-3 flex-shrink-0">
                      {getInitial(conv.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="font-semibold text-gray-900 truncate pr-2">{conv.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.id.split('@')[0]}</p>
                    </div>
                  </button>
                )
              })}
              
              {hasMore && (
                <button 
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full py-4 text-sm text-whatsapp font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  {loadingMore ? <Loader2Icon className="w-4 h-4 animate-spin" /> : 'Load More Contacts'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")' }} />

          <div className="h-16 bg-gray-50 border-b border-gray-200 px-6 flex items-center justify-between z-10 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">
                {getInitial(selectedConv.name)}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 leading-tight">{selectedConv.name}</h2>
                <p className="text-xs text-gray-500">{selectedConv.id.split('@')[0]}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
              <button className="hover:text-gray-700 transition-colors cursor-pointer"><VideoIcon className="w-5 h-5" /></button>
              <button className="hover:text-gray-700 transition-colors cursor-pointer"><PhoneIcon className="w-5 h-5" /></button>
              <button className="hover:text-gray-700 transition-colors cursor-pointer"><MoreVerticalIcon className="w-5 h-5" /></button>
              <button onClick={() => setSelectedConv(null)} className="hover:text-gray-700 transition-colors cursor-pointer lg:hidden"><XIcon className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 z-10 custom-scrollbar">
            {loadingMsgs ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2Icon className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => {
                  const isFirstInGroup = idx === 0 || messages[idx - 1].fromMe !== msg.fromMe
                  return (
                    <div key={msg.id || idx} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-3 py-2 shadow-sm relative ${msg.fromMe ? 'bg-whatsapp-light text-gray-900 rounded-l-lg rounded-br-lg' : 'bg-white text-gray-900 rounded-r-lg rounded-bl-lg'} ${isFirstInGroup && msg.fromMe ? 'rounded-tr-none' : ''} ${isFirstInGroup && !msg.fromMe ? 'rounded-tl-none' : ''}`}>
                        {isFirstInGroup && (
                          <div className={`absolute top-0 w-3 h-3 ${msg.fromMe ? '-right-2 bg-whatsapp-light' : '-left-2 bg-white'}`} style={{ clipPath: msg.fromMe ? 'polygon(0 0, 0 100%, 100% 0)' : 'polygon(100% 0, 100% 100%, 0 0)' }} />
                        )}
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.body}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 ${msg.fromMe ? 'text-gray-500' : 'text-gray-400'}`}>
                          <span className="text-[10px]">{formatTime(msg.timestamp)}</span>
                          {msg.fromMe && <CheckCheckIcon className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-3 px-4 flex items-end space-x-3 z-10 flex-shrink-0">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 mb-1 cursor-pointer"><SmileIcon className="w-6 h-6" /></button>
            <div className="flex-1 bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message"
                className="w-full max-h-32 min-h-[44px] py-3 px-4 resize-none focus:outline-none text-[15px]"
                rows={1}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!messageInput.trim() || sending}
              className={`p-3 rounded-full flex-shrink-0 mb-0.5 transition-colors cursor-pointer ${messageInput.trim() && !sending ? 'bg-whatsapp text-white hover:bg-whatsapp-hover shadow-sm' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {sending ? <Loader2Icon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 border-l border-gray-200">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <MessageSquareIcon className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-light text-gray-600 mb-2">WhatsApp CRM Web</h2>
          <p className="text-gray-400 text-sm max-w-md text-center">Select a contact from your CRM to start messaging.</p>
        </div>
      )}
    </motion.div>
    </WhatsAppRequired>
  )
}
