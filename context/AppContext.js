'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { getUser, saveUser, saveTokens, clearTokens, isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'
import { getUnreadCount } from '@/lib/notifications'
import { loginApi, registerApi } from '@/lib/auth-api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser]                   = useState(null)
  const [sessionStatus, setSessionStatus] = useState('disconnected')
  const [authLoading, setAuthLoading]     = useState(true)
  const [unreadConversations, setUnreadConversations] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const pollRef     = useRef(null)
  const notifPollRef = useRef(null)

  useEffect(() => {
    const stored = getUser()
    if (stored && isAuthenticated()) setUser(stored)
    setAuthLoading(false)
  }, [])

  // poll WhatsApp status globally every 10s when user is logged in
  useEffect(() => {
    if (!user) { clearInterval(pollRef.current); return }

    const fetchStatus = () => {
      api.get('/whatsapp/status')
        .then(res => { if (res.data?.status) setSessionStatus(res.data.status) })
        .catch(() => {})
    }

    fetchStatus()
    pollRef.current = setInterval(fetchStatus, 10000)
    return () => clearInterval(pollRef.current)
  }, [user])

  // poll unread notifications every 15s
  useEffect(() => {
    if (!user) { clearInterval(notifPollRef.current); return }

    const fetchUnread = () => {
      getUnreadCount()
        .then(res => setUnreadNotifications(res.data?.count || 0))
        .catch(() => {})
    }

    fetchUnread()
    notifPollRef.current = setInterval(fetchUnread, 15000)
    return () => clearInterval(notifPollRef.current)
  }, [user])

  const login = async ({ email, password }) => {
    const data = await loginApi(email, password)
    const { user, accessToken, refreshToken } = data.data
    saveTokens(accessToken, refreshToken)
    saveUser(user)
    setUser(user)
    return user
  }

  const register = async ({ name, email, password }) => {
    return registerApi(name, email, password)
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    clearTokens()
    setUser(null)
  }

  return (
    <AppContext.Provider value={{
      user, setUser, authLoading,
      login, register, logout,
      isAuthenticated: !!user,
      sessionStatus, setSessionStatus,
      unreadConversations, setUnreadConversations,
      unreadNotifications, setUnreadNotifications,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
