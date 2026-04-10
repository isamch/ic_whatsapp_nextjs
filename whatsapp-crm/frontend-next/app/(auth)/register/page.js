'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MessageSquareIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon, CheckIcon } from 'lucide-react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { handleApiError } from '@/lib/handleApiError'
import { validateRegister } from '@/lib/validations/auth/registerValidation'

const passwordRules = [
  { label: 'At least 8 characters',           test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',             test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter',             test: (p) => /[a-z]/.test(p) },
  { label: 'One number',                       test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (@$!%*?&)',  test: (p) => /[@$!%*?&]/.test(p) },
]

export default function RegisterPage() {
  const [form, setForm]                 = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [errors, setErrors]             = useState({})

  const { register } = useApp()
  const router       = useRouter()

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e_ = validateRegister(form)
    if (Object.keys(e_).length) { setErrors(e_); return }

    setErrors({})
    setIsLoading(true)

    try {
      await register({ name: form.name, email: form.email, password: form.password })
      router.push('/login')
    } catch (err) {
      handleApiError(err, { setErrors })
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
            Start sending smarter<br />
            <span className="text-whatsapp">WhatsApp campaigns</span><br />
            today.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Join hundreds of businesses using WhatsApp CRM to automate messaging and grow customer relationships.
          </p>
          <div className="space-y-4">
            {['Bulk messaging with rate control', 'Contact list management & validation', 'Message templates with variables', 'Real-time campaign analytics'].map((f) => (
              <div key={f} className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-whatsapp/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckIcon className="w-3 h-3 text-whatsapp" />
                </div>
                <span className="text-gray-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 bg-white/5 rounded-xl p-5 border border-white/10">
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            &ldquo;Setup took less than 5 minutes. We sent our first campaign the same day.&rdquo;
          </p>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-whatsapp/20 flex items-center justify-center mr-3">
              <span className="text-whatsapp text-xs font-bold">MK</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Mohamed Karim</p>
              <p className="text-gray-500 text-xs">CEO, TechStartup</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-500">Get started for free, no credit card required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="name" type="text" value={form.name} onChange={update('name')} placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-whatsapp/40 focus:border-whatsapp transition-all text-gray-900 placeholder-gray-400 bg-white ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-whatsapp/40 focus:border-whatsapp transition-all text-gray-900 placeholder-gray-400 bg-white ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-whatsapp/40 focus:border-whatsapp transition-all text-gray-900 placeholder-gray-400 bg-white ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              {form.password && (
                <div className="mt-2 space-y-1">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 transition-colors ${rule.test(form.password) ? 'bg-whatsapp' : 'bg-gray-200'}`}>
                        {rule.test(form.password) && <CheckIcon className="w-2 h-2 text-white" />}
                      </div>
                      <span className={`text-xs transition-colors ${rule.test(form.password) ? 'text-whatsapp' : 'text-gray-400'}`}>{rule.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-whatsapp/40 focus:border-whatsapp transition-all text-gray-900 placeholder-gray-400 bg-white ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showConfirm ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
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
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-whatsapp hover:text-whatsapp-hover font-semibold transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
