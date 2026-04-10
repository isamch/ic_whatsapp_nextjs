'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  MessageSquareIcon, UsersIcon, SendIcon, BarChart3Icon,
  ShieldCheckIcon, ZapIcon, CheckIcon, MenuIcon, XIcon,
  ArrowRightIcon, StarIcon, PlayIcon,
} from 'lucide-react'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } }

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activePlan, setActivePlan] = useState('monthly')

  return (
    <div className="bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-whatsapp rounded-lg flex items-center justify-center mr-2.5">
              <MessageSquareIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">WhatsApp CRM</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Pricing', 'Testimonials'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Sign in</Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-whatsapp hover:bg-whatsapp-hover px-4 py-2 rounded-lg transition-colors shadow-sm">Get started free</Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-900 cursor-pointer">
            {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
            {['Features', 'Pricing', 'Testimonials'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-gray-900 font-medium py-2">{item}</a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
              <Link href="/login" className="text-sm font-medium text-center text-gray-700 border border-gray-300 px-4 py-2.5 rounded-lg">Sign in</Link>
              <Link href="/register" className="text-sm font-semibold text-center text-white bg-whatsapp px-4 py-2.5 rounded-lg">Get started free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div {...fadeUp} className="inline-flex items-center bg-whatsapp/10 text-whatsapp text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-whatsapp/20">
              <ZapIcon className="w-3.5 h-3.5 mr-1.5" />
              Now with bulk campaign scheduling
            </motion.div>

            <motion.h1 {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              The WhatsApp CRM<br />
              <span className="text-whatsapp">built for scale</span>
            </motion.h1>

            <motion.p {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} className="text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              Send bulk campaigns, manage contacts, track conversations, and automate messaging — all from one powerful dashboard.
            </motion.p>

            <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="flex items-center px-8 py-3.5 bg-whatsapp hover:bg-whatsapp-hover text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer">
                Start for free <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/login" className="flex items-center px-8 py-3.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                <PlayIcon className="w-4 h-4 mr-2 text-whatsapp" /> Watch demo
              </Link>
            </motion.div>

            <motion.p {...fadeUp} transition={{ delay: 0.4, duration: 0.5 }} className="text-sm text-gray-400 mt-4">
              No credit card required · Free 14-day trial
            </motion.p>
          </div>

          {/* Dashboard Preview */}
          <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.6 }} className="relative max-w-5xl mx-auto">
            <div className="bg-sidebar rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Fake browser bar */}
              <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex-1 mx-4 bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400">app.whatsappcrm.com</div>
              </div>
              {/* Dashboard mockup */}
              <div className="flex h-64 md:h-80">
                {/* Sidebar mockup */}
                <div className="w-48 bg-sidebar border-r border-gray-800 p-3 hidden md:block">
                  <div className="flex items-center mb-4 px-2">
                    <div className="w-6 h-6 bg-whatsapp rounded-md mr-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                  </div>
                  {[80, 70, 60, 75, 65].map((w, i) => (
                    <div key={i} className={`flex items-center px-3 py-2 rounded-lg mb-1 ${i === 0 ? 'bg-sidebar-active' : ''}`}>
                      <div className={`w-4 h-4 rounded mr-2 ${i === 0 ? 'bg-whatsapp' : 'bg-gray-700'}`}></div>
                      <div className={`h-2.5 rounded ${i === 0 ? 'bg-gray-400' : 'bg-gray-700'}`} style={{ width: `${w}%` }}></div>
                    </div>
                  ))}
                </div>
                {/* Main content mockup */}
                <div className="flex-1 bg-page p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {['bg-white', 'bg-white', 'bg-white', 'bg-white'].map((bg, i) => (
                      <div key={i} className={`${bg} rounded-lg p-3 border border-gray-200`}>
                        <div className="w-6 h-6 bg-gray-100 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="h-2.5 bg-gray-200 rounded w-1/4 mb-3"></div>
                    {[90, 70, 55].map((w, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-whatsapp mr-2"></div>
                        <div className="h-2 bg-gray-200 rounded flex-1 mr-3"></div>
                        <div className="h-1.5 bg-whatsapp/30 rounded" style={{ width: `${w}px` }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-whatsapp/5 rounded-3xl -z-10 blur-2xl"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '10K+', label: 'Messages per day' },
            { value: '98.4%', label: 'Delivery rate' },
            { value: '500+', label: 'Active businesses' },
            { value: '<2min', label: 'Setup time' },
          ].map(({ value, label }) => (
            <motion.div key={label} {...fadeUp} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-whatsapp font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to scale</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">A complete toolkit for WhatsApp marketing and customer management.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: SendIcon, title: 'Bulk Campaigns', desc: 'Send thousands of personalized messages with rate control to avoid bans. Schedule campaigns for optimal delivery times.', color: 'bg-green-50 text-whatsapp' },
              { icon: UsersIcon, title: 'Contact Management', desc: 'Organize contacts into lists and categories. Import via CSV, validate phone numbers, and segment your audience.', color: 'bg-blue-50 text-blue-600' },
              { icon: MessageSquareIcon, title: 'Live Conversations', desc: 'Manage real-time WhatsApp conversations from a unified inbox. Never miss a customer message again.', color: 'bg-purple-50 text-purple-600' },
              { icon: BarChart3Icon, title: 'Analytics Dashboard', desc: 'Track message delivery, campaign performance, and engagement metrics with detailed real-time reports.', color: 'bg-amber-50 text-amber-600' },
              { icon: ShieldCheckIcon, title: 'Role-Based Access', desc: 'Control who can do what with granular permissions. Assign roles to team members and manage access securely.', color: 'bg-red-50 text-red-600' },
              { icon: ZapIcon, title: 'Message Templates', desc: 'Create reusable templates with dynamic variables. Personalize messages at scale with contact data.', color: 'bg-indigo-50 text-indigo-600' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-whatsapp/30 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-whatsapp font-semibold text-sm uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by businesses worldwide</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Ahmed', role: 'Marketing Director', company: 'RetailCo', text: 'WhatsApp CRM transformed how we communicate with customers. Our campaign open rates went from 20% to 85% overnight.', avatar: 'SA' },
              { name: 'Mohamed Karim', role: 'CEO', company: 'TechStartup', text: 'Setup took less than 5 minutes. We sent our first campaign the same day. The bulk messaging with rate control is a game changer.', avatar: 'MK' },
              { name: 'Fatima Zahra', role: 'Operations Manager', company: 'EcomStore', text: 'The contact validation feature alone saved us hours of manual work. Highly recommend for any business using WhatsApp.', avatar: 'FZ' },
            ].map(({ name, role, company, text, avatar }, i) => (
              <motion.div key={name} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-whatsapp/20 flex items-center justify-center mr-3">
                    <span className="text-whatsapp text-sm font-bold">{avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{role}, {company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-whatsapp font-semibold text-sm uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl p-1 mt-4">
              {['monthly', 'yearly'].map((plan) => (
                <button key={plan} onClick={() => setActivePlan(plan)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize cursor-pointer ${activePlan === plan ? 'bg-whatsapp text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                  {plan} {plan === 'yearly' && <span className="text-xs ml-1 opacity-80">-20%</span>}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter', price: activePlan === 'monthly' ? 29 : 23, desc: 'Perfect for small businesses',
                features: ['1 WhatsApp number', '5,000 messages/month', '500 contacts', 'Basic templates', 'Email support'],
                cta: 'Get started', highlight: false,
              },
              {
                name: 'Pro', price: activePlan === 'monthly' ? 79 : 63, desc: 'For growing businesses',
                features: ['3 WhatsApp numbers', '50,000 messages/month', 'Unlimited contacts', 'Advanced templates', 'Campaign scheduling', 'Priority support'],
                cta: 'Start free trial', highlight: true,
              },
              {
                name: 'Enterprise', price: activePlan === 'monthly' ? 199 : 159, desc: 'For large organizations',
                features: ['Unlimited numbers', 'Unlimited messages', 'Unlimited contacts', 'Custom templates', 'API access', 'Dedicated support', 'Custom integrations'],
                cta: 'Contact sales', highlight: false,
              },
            ].map(({ name, price, desc, features, cta, highlight }, i) => (
              <motion.div key={name} {...fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className={`rounded-2xl p-6 border-2 relative ${highlight ? 'border-whatsapp bg-white shadow-xl' : 'border-gray-200 bg-white'}`}>
                {highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-whatsapp text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
                <p className="text-gray-500 text-sm mb-4">{desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-whatsapp mr-2 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${highlight ? 'bg-whatsapp hover:bg-whatsapp-hover text-white shadow-sm' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                  {cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-sidebar">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="w-16 h-16 bg-whatsapp rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquareIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Join 500+ businesses already using WhatsApp CRM to grow their customer relationships.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="flex items-center px-8 py-3.5 bg-whatsapp hover:bg-whatsapp-hover text-white font-semibold rounded-xl transition-all shadow-md cursor-pointer">
                Start for free <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/login" className="flex items-center px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all cursor-pointer border border-white/20">
                Sign in to your account
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-6">No credit card required · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-7 h-7 bg-whatsapp rounded-lg flex items-center justify-center mr-2">
              <MessageSquareIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">WhatsApp CRM</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 WhatsApp CRM. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
