'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  MessageSquareIcon, UsersIcon, SendIcon, FileTextIcon,
  SmartphoneIcon, QrCodeIcon, CheckCircle2Icon, PlusIcon,
  UploadIcon, ActivityIcon, Loader2Icon, ListIcon,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useAlert } from '@/context/AlertContext'
import { StatCard, Modal } from '@/components/ui'
import WhatsAppRequired from '@/components/WhatsAppRequired'
import { connectWhatsapp, getWhatsappQR, getWhatsappStatus, disconnectWhatsapp } from '@/lib/whatsapp'
import api from '@/lib/api'

export default function DashboardPage() {
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrImage, setQrImage] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const { sessionStatus, setSessionStatus } = useApp()
  const { showAlert } = useAlert()
  const router = useRouter()
  const pollRef = useRef(null)

  // poll status every 3s when modal is open
  useEffect(() => {
    if (!showQrModal) { clearInterval(pollRef.current); return }

    pollRef.current = setInterval(async () => {
      try {
        const res = await getWhatsappStatus()
        const status = res.data?.status

        if (status === 'connected') {
          setSessionStatus('connected')
          clearInterval(pollRef.current)
          setShowQrModal(false)
          setQrImage(null)
          showAlert('WhatsApp connected successfully!', 'success')
        }

        // refresh QR if still pending
        if (status === 'qr_pending' && !qrImage) fetchQR()
      } catch { }
    }, 3000)

    return () => clearInterval(pollRef.current)
  }, [showQrModal, qrImage])

  // fetch stats on mount
  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => { })
      .finally(() => setStatsLoading(false))
  }, [])

  const fetchQR = async () => {
    try {
      const res = await getWhatsappQR()
      if (res.data?.qr) setQrImage(res.data.qr)
    } catch { }
  }

  const handleConnect = async () => {
    setQrLoading(true)
    setShowQrModal(true)
    try {
      await connectWhatsapp()
      // wait a bit then fetch QR
      setTimeout(async () => {
        await fetchQR()
        setQrLoading(false)
      }, 2000)
    } catch (err) {
      showAlert(err.message || 'Failed to connect', 'error')
      setShowQrModal(false)
      setQrLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWhatsapp()
      setSessionStatus('disconnected')
      showAlert('WhatsApp disconnected', 'info')
    } catch {
      showAlert('Failed to disconnect', 'error')
    }
  }

  const activeCampaignsCount = stats?.recentCampaigns?.filter(c => c.status === 'running' || c.status === 'paused').length ?? '—'
  const completedCount = stats?.recentCampaigns?.filter(c => c.status === 'completed').length ?? '—'

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto">

      {/* WhatsApp Connection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${sessionStatus === 'connected' ? 'bg-green-100 text-whatsapp' : 'bg-red-100 text-red-500'}`}>
            <SmartphoneIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">WhatsApp Connection</h2>
            {sessionStatus === 'connected' ? (
              <div className="flex items-center mt-1">
                <span className="flex h-2.5 w-2.5 bg-whatsapp rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm text-gray-600">Connected</span>
              </div>
            ) : (
              <div className="flex items-center mt-1">
                <span className="flex h-2.5 w-2.5 bg-red-500 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Disconnected — scan QR to connect</span>
              </div>
            )}
          </div>
        </div>

        {sessionStatus !== 'connected' ? (
          <button onClick={handleConnect} className="bg-whatsapp hover:bg-whatsapp-hover text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-sm cursor-pointer">
            <QrCodeIcon className="w-5 h-5 mr-2" /> Connect WhatsApp
          </button>
        ) : (
          <button onClick={handleDisconnect} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer">
            Disconnect
          </button>
        )}
      </div>

      <WhatsAppRequired>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Messages" value={statsLoading ? '...' : (stats?.messageCount ?? 0).toLocaleString()} icon={MessageSquareIcon} />
          <StatCard title="Total Contacts" value={statsLoading ? '...' : (stats?.totalContacts ?? 0).toLocaleString()} icon={UsersIcon} />
          <StatCard title="Total Campaigns" value={statsLoading ? '...' : (stats?.totalCampaigns ?? 0).toLocaleString()} icon={SendIcon} />
          <StatCard title="Total Templates" value={statsLoading ? '...' : (stats?.totalTemplates ?? 0).toLocaleString()} icon={FileTextIcon} />
        </div>

        {/* Campaign Overview + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Overview</h3>
              <button onClick={() => router.push('/campaigns')} className="text-sm text-whatsapp hover:text-whatsapp-hover font-medium cursor-pointer">View All</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Running</p>
                <p className="text-2xl font-bold text-gray-900">{activeCampaignsCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : stats?.totalCampaigns ?? 0}</p>
              </div>
            </div>


            {/* Recent Campaigns */}
            <div className="space-y-4">
              {statsLoading ? (
                <div className="text-center py-6 text-gray-400 text-sm">Loading...</div>
              ) : stats?.recentCampaigns?.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">No campaigns yet</div>
              ) : (
                stats?.recentCampaigns?.map(campaign => (
                  <div key={campaign._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${campaign.status === 'running' ? 'bg-whatsapp animate-pulse' :
                          campaign.status === 'completed' ? 'bg-gray-400' : 'bg-amber-500'
                        }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-xs text-gray-500">
                          {campaign.sentCount} / {campaign.totalContacts} sent • {campaign.status}
                        </p>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${campaign.status === 'running' ? 'bg-whatsapp' : 'bg-gray-400'}`}
                        style={{ width: `${campaign.totalContacts ? (campaign.sentCount / campaign.totalContacts * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: 'New Campaign', icon: PlusIcon, href: '/campaigns' },
                  { label: 'Import Contacts', icon: UploadIcon, href: '/contacts' },
                  { label: 'Create Template', icon: FileTextIcon, href: '/templates' },
                ].map(({ label, icon: Icon, href }) => (
                  <button key={label} onClick={() => router.push(href)} className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-whatsapp hover:bg-green-50 transition-colors group cursor-pointer">
                    <div className="bg-gray-100 group-hover:bg-whatsapp/10 p-2 rounded-md mr-3 text-gray-600 group-hover:text-whatsapp transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-whatsapp transition-colors">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ActivityIcon className="w-5 h-5 mr-2 text-gray-400" /> Recent Activity
              </h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                <ActivityItem title="Campaign Completed" desc="March Webinar Invites finished." time="2 hours ago" type="success" />
                <ActivityItem title="Contacts Imported" desc="850 contacts added to Leads." time="5 hours ago" type="info" />
                <ActivityItem title="Template Created" desc="Feedback Request template saved." time="1 day ago" type="default" />
              </div>
            </div>
          </div>
        </div>
      </WhatsAppRequired>

      {/* QR Modal */}
      {showQrModal && (
        <Modal onClose={() => { setShowQrModal(false); clearInterval(pollRef.current) }}>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect WhatsApp</h2>
            <p className="text-gray-600 mb-8">Open WhatsApp → Linked Devices → Link a Device. Point your phone to this screen.</p>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 inline-block mb-8">
              {qrLoading && !qrImage ? (
                <div className="w-48 h-48 flex flex-col items-center justify-center text-gray-400">
                  <Loader2Icon className="w-10 h-10 animate-spin mb-3" />
                  <span className="text-sm">Generating QR...</span>
                </div>
              ) : qrImage ? (
                <img src={qrImage} alt="WhatsApp QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 flex flex-col items-center justify-center text-gray-400">
                  <Loader2Icon className="w-10 h-10 animate-spin mb-3" />
                  <span className="text-sm">Waiting for QR...</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mb-6">QR code refreshes automatically every 30 seconds</p>
            <button
              onClick={() => { setShowQrModal(false); clearInterval(pollRef.current) }}
              className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}

function ActivityItem({ title, desc, time, type }) {
  const config = {
    success: { bg: 'bg-whatsapp', icon: <CheckCircle2Icon className="w-4 h-4 text-white" /> },
    info: { bg: 'bg-blue-500', icon: <UsersIcon className="w-4 h-4 text-white" /> },
    default: { bg: 'bg-gray-500', icon: <FileTextIcon className="w-4 h-4 text-white" /> },
  }
  const { bg, icon } = config[type] || config.default
  return (
    <div className="relative flex items-start space-x-3">
      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm ${bg}`}>{icon}</div>
      <div className="flex-1 min-w-0 bg-gray-50 rounded-lg p-3 border border-gray-100">
        <div className="flex justify-between items-center mb-0.5">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  )
}
