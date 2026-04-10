'use client'

import { useEffect, useState, useRef } from 'react'
import { XCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const TYPES = {
  error: {
    Icon: XCircle,
    label: 'Error',
    bar: 'bg-red-500',
    wrapper: 'bg-white border-l-4 border-red-500',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    labelColor: 'text-red-500',
    msgColor: 'text-gray-600',
    shadow: 'shadow-[0_8px_30px_rgba(239,68,68,0.15)]',
  },
  success: {
    Icon: CheckCircle2,
    label: 'Success',
    bar: 'bg-emerald-500',
    wrapper: 'bg-white border-l-4 border-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    labelColor: 'text-emerald-600',
    msgColor: 'text-gray-600',
    shadow: 'shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
  },
  warning: {
    Icon: AlertTriangle,
    label: 'Warning',
    bar: 'bg-amber-400',
    wrapper: 'bg-white border-l-4 border-amber-400',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    labelColor: 'text-amber-600',
    msgColor: 'text-gray-600',
    shadow: 'shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
  },
  info: {
    Icon: Info,
    label: 'Info',
    bar: 'bg-blue-500',
    wrapper: 'bg-white border-l-4 border-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    labelColor: 'text-blue-600',
    msgColor: 'text-gray-600',
    shadow: 'shadow-[0_8px_30px_rgba(59,130,246,0.15)]',
  },
}

export default function Alert({ message, type = 'error', onClose, duration = 5000 }) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const cfg = TYPES[type] || TYPES.error
  const { Icon } = cfg

  useEffect(() => {
    if (!message) return

    setVisible(true)
    setProgress(100)

    const step = 100 / (duration / 50)
    intervalRef.current = setInterval(() => {
      setProgress(p => Math.max(0, p - step))
    }, 50)

    timeoutRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 400)
    }, duration)

    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [message])

  const handleClose = () => {
    clearInterval(intervalRef.current)
    clearTimeout(timeoutRef.current)
    setVisible(false)
    setTimeout(onClose, 400)
  }

  if (!message) return null

  return (
    <div
      className={`
        fixed top-5 right-5 z-[9999] w-[340px] rounded-xl overflow-hidden
        ${cfg.wrapper} ${cfg.shadow}
        transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${visible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-16 scale-95'}
      `}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-[3px] w-full bg-gray-100">
        <div
          className={`h-full ${cfg.bar} transition-all duration-50 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex items-start gap-3 px-4 pt-5 pb-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${cfg.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${cfg.labelColor}`}>
            {cfg.label}
          </p>
          <p className={`text-sm leading-snug ${cfg.msgColor}`}>{message}</p>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all duration-150 cursor-pointer mt-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
