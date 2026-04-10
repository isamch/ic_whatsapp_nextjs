'use client'

import { createContext, useContext, useState } from 'react'
import Alert from '@/components/ui/Alert'

const AlertContext = createContext(null)

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ message: '', type: 'error' })

  const showAlert = (message, type = 'error') => setAlert({ message, type })
  const hideAlert = () => setAlert({ message: '', type: 'error' })

  return (
    <AlertContext.Provider value={{ showAlert }}>
      <Alert message={alert.message} type={alert.type} onClose={hideAlert} />
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx
}
