'use client'

import { AppProvider } from '@/context/AppContext'
import { AlertProvider } from '@/context/AlertContext'

export default function Providers({ children }) {
  return (
    <AppProvider>
      <AlertProvider>
        {children}
      </AlertProvider>
    </AppProvider>
  )
}
