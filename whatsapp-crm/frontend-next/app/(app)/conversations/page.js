'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  SearchIcon, CheckCheckIcon, SmileIcon, SendIcon,
  MoreVerticalIcon, PhoneIcon, VideoIcon, MessageSquareIcon, Loader2Icon, XIcon,
} from 'lucide-react'
import { getConversations, getMessages, sendMessage } from '@/lib/conversations'
import { useAlert } from '@/context/AlertContext'
import { useApp } from '@/context/AppContext'
import WhatsAppRequired from '@/components/WhatsAppRequired'

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const messagesEndRef = useRef(null)
  const { showAlert } = useAlert()
  const { sessionStatus, setUnreadConversations } = useApp()

  useEffect(() => {
    if (sessionStatus !== 'connected') { setLoadingConvs(false); return }
    getConversations()
      .then(res => {
        const convs = res.data?.conversations || []
        setConversations(convs)
        setUnreadConversations(convs.reduce((acc, c) => acc + (c.unreadCount || 0), 0))
      })
      .catch(() => showAlert('Failed to load conversations', 'error'))
      .finally(() => setLoadingConvs(false))
  }, [sessionStatus])

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
  }, [])

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

  const formatLastMsgTime = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    const diffDays = Math.floor((Date.now() - date) / 86400000)
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return 'Yesterday'
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' })
  }

  const getInitial = (name) => (name || '?').charAt(0).toUpperCase()

  const filteredConversations = conversations.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.id || '').includes(searchQuery)
  )

  return (
    <WhatsAppRequired>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex bg-white">

      {/* Conversation List */}
      <div className="w-[350px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white z-10">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp transition-shadow"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loadingConvs ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <MessageSquareIcon className="w-10 h-10 mb-2 text-gray-300" />
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id
              const name = conv.name || conv.id
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`w-full flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${isSelected ? 'bg-green-50/50' : ''}`}
                >
                  <div className="relative mr-3 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg">
                      {getInitial(name)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-medium text-gray-900 truncate pr-2">{name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">{formatLastMsgTime(conv.lastMessageTime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 truncate pr-2">{conv.lastMessage || ''}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-whatsapp text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{conv.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col bg-[#efeae2] relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")' }} />

          <div className="h-16 bg-gray-50 border-b border-gray-200 px-6 flex items-center justify-between z-10 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-3">
                {getInitial(selectedConv.name)}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 leading-tight">{selectedConv.name || selectedConv.id}</h2>
                <p className="text-xs text-gray-500">{selectedConv.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
              <button className="hover:text-gray-700 transition-colors cursor-pointer"><VideoIcon className="w-5 h-5" /></button>
              <button className="hover:text-gray-700 transition-colors cursor-pointer"><PhoneIcon className="w-5 h-5" /></button>
              <button className="hover:text-gray-700 transition-colors cursor-pointer"><MoreVerticalIcon className="w-5 h-5" /></button>
              <button onClick={() => setSelectedConv(null)} className="hover:text-gray-700 transition-colors cursor-pointer"><XIcon className="w-5 h-5" /></button>
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
                  const msgId = `${msg.id || ''}_${idx}`
                  const isFirstInGroup = idx === 0 || messages[idx - 1].fromMe !== msg.fromMe
                  return (
                    <div key={msgId} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-3 py-2 shadow-sm relative ${msg.fromMe ? 'bg-whatsapp-light text-gray-900 rounded-l-lg rounded-br-lg' : 'bg-white text-gray-900 rounded-r-lg rounded-bl-lg'} ${isFirstInGroup && msg.fromMe ? 'rounded-tr-none' : ''} ${isFirstInGroup && !msg.fromMe ? 'rounded-tl-none' : ''}`}>
                        {isFirstInGroup && (
                          <div className={`absolute top-0 w-3 h-3 ${msg.fromMe ? '-right-2 bg-whatsapp-light' : '-left-2 bg-white'}`} style={{ clipPath: msg.fromMe ? 'polygon(0 0, 0 100%, 100% 0)' : 'polygon(100% 0, 100% 100%, 0 0)' }} />
                        )}
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.body}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 ${msg.fromMe ? 'text-gray-500' : 'text-gray-400'}`}>
                          <span className="text-[10px]">{formatTime(msg.timestamp)}</span>
                          {msg.fromMe && <CheckCheckIcon className="w-3.5 h-3.5" />}
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
          <p className="text-gray-400 text-sm max-w-md text-center">Select a conversation from the sidebar to start messaging, or search for a contact to begin a new chat.</p>
        </div>
      )}
    </motion.div>
    </WhatsAppRequired>
  )
}
