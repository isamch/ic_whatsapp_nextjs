'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MessageSquareIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { useAlert } from '@/context/AlertContext'
import { handleApiError } from '@/lib/handleApiError'
import { validateLogin } from '@/lib/validations/auth/loginValidation'

export default function LoginPage() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [errors, setErrors]             = useState({})

  const { login }     = useApp()
  const { showAlert } = useAlert()
  const router        = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e_ = validateLogin({ email, password })
    if (Object.keys(e_).length) { setErrors(e_); return }

    setErrors({})
    setIsLoading(true)

    try {
      await login({ email, password })
      router.push('/dashboard')
    } catch (err) {
      handleApiError(err, { setErrors, showAlert })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-page flex">
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-whatsapp rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-whatsapp rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 flex items-center">
          <div className="w-10 h-10 bg-whatsapp rounded-xl flex items-center justify-center mr-3">
            <MessageSquareIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">WhatsApp CRM</span>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Manage all your<br />
            <span className="text-whatsapp">WhatsApp conversations</span><br />
            in one place.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Send bulk campaigns, manage contacts, and track performance — all from a single dashboard.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[{ value: '10K+', label: 'Messages/day' }, { value: '98%', label: 'Delivery rate' }, { value: '500+', label: 'Active users' }].map(({ value, label }) => (
              <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-whatsapp">{value}</p>
                <p className="text-gray-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 bg-white/5 rounded-xl p-5 border border-white/10">
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            &ldquo;WhatsApp CRM transformed how we communicate with our customers. Campaign delivery is seamless.&rdquo;
          </p>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-whatsapp/20 flex items-center justify-center mr-3">
              <span className="text-whatsapp text-xs font-bold">SA</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Sarah Ahmed</p>
              <p className="text-gray-500 text-xs">Marketing Director</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 bg-whatsapp rounded-xl flex items-center justify-center mr-3">
              <MessageSquareIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-xl">WhatsApp CRM</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-whatsapp/40 focus:border-whatsapp transition-all text-gray-900 placeholder-gray-400 bg-white ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="#" className="text-sm text-whatsapp hover:text-whatsapp-hover font-medium transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-whatsapp/40 focus:border-whatsapp transition-all text-gray-900 placeholder-gray-400 bg-white ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-whatsapp hover:bg-whatsapp-hover text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-whatsapp hover:text-whatsapp-hover font-semibold transition-colors">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
