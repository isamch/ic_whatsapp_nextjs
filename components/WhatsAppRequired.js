'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Settings, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'

export default function WhatsAppRequired({ children }) {
  const { sessionStatus } = useApp()

  const isConnected = sessionStatus === 'connected'

  return (
    <div className="relative w-full h-full min-h-full flex flex-col items-stretch justify-items-stretch">
      <div 
        className={`w-full h-full flex flex-col flex-1 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          !isConnected
            ? 'pointer-events-none select-none blur-[6px] opacity-40 grayscale-[50%] brightness-75'
            : ''
        }`}
      >
        {children}
      </div>

      <AnimatePresence>
        {!isConnected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-transparent"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="relative max-w-sm w-full overflow-hidden rounded-[2rem] border border-white/20 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 text-center"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/20 rounded-full blur-[40px] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [ -5, 5, -5 ] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-20 h-20 mb-6 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center border border-red-200 dark:border-red-500/20 shadow-inner relative"
                >
                  <Smartphone className="w-10 h-10 text-red-500" strokeWidth={1.5} />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 mb-2">
                  WhatsApp Disconnected
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  This feature requires an active WhatsApp connection. Please connect your device to continue using all features.
                </p>

                <Link 
                  href="/settings"
                  className="group relative inline-flex items-center justify-center w-full px-6 py-3.5 text-sm font-semibold text-white transition-all bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4 transition-transform group-hover:rotate-90" />
                    Go to Settings &amp; Connect
                  </span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
