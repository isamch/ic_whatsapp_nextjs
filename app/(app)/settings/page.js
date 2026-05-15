'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { UserIcon, LockIcon, SmartphoneIcon, ShieldAlertIcon, Loader2Icon } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader, FormField } from '@/components/ui'
import { updateProfile, changePassword } from '@/lib/settings'
import { validateUpdatePassword } from '@/lib/validations/settings/updatePassword.validation'
import { getWhatsappProfile, disconnectWhatsapp } from '@/lib/whatsapp'
import { useAlert } from '@/context/AlertContext'
import { saveUser } from '@/lib/auth'

export default function SettingsPage() {
  const { user, sessionStatus, setSessionStatus, setUser } = useApp()
  const currentUser = user || {}
  const router = useRouter()
  const { showAlert } = useAlert()

  const [name, setName]                   = useState(currentUser.name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword]   = useState('')
  const [newPassword, setNewPassword]           = useState('')
  const [confirmPassword, setConfirmPassword]   = useState('')
  const [savingPassword, setSavingPassword]     = useState(false)
  const [passwordErrors, setPasswordErrors]     = useState({})

  const [waProfile, setWaProfile]         = useState(null)
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    if (sessionStatus !== 'connected') { setWaProfile(null); return }
    getWhatsappProfile()
      .then(res => setWaProfile(res.data?.profile || null))
      .catch(() => {})
  }, [sessionStatus])

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      await disconnectWhatsapp()
      setSessionStatus('disconnected')
      setWaProfile(null)
      showAlert('WhatsApp disconnected', 'success')
    } catch {
      showAlert('Failed to disconnect', 'error')
    } finally {
      setDisconnecting(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) return
    setSavingProfile(true)
    try {
      const res = await updateProfile({ name })
      const updated = { ...currentUser, ...res.data?.user, name }
      saveUser(updated)
      setUser(updated)
      showAlert('Profile updated successfully', 'success')
    } catch {
      showAlert('Failed to update profile', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    const errs = validateUpdatePassword({ currentPassword, newPassword, confirmPassword })
    if (Object.keys(errs).length) { setPasswordErrors(errs); return }
    setPasswordErrors({})
    setSavingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showAlert('Password changed successfully', 'success')
    } catch (err) {
      showAlert(err?.response?.data?.message || 'Failed to change password', 'error')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto">
      <PageHeader title="Account Settings" description="Manage your profile, security, and connections." />

      <div className="space-y-8">
        {/* Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center bg-gray-50">
            <UserIcon className="w-5 h-5 text-gray-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden mr-6">
                {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-8 h-8 text-gray-400" />}
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Change Avatar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Username">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none"
                />
              </FormField>
              <FormField label="Email Address">
                <input type="email" defaultValue={currentUser.email} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none bg-gray-50" readOnly />
              </FormField>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile || !name.trim()}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {savingProfile && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp Connection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center bg-gray-50">
            <SmartphoneIcon className="w-5 h-5 text-gray-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">WhatsApp Connection</h2>
          </div>
          <div className="p-6">
            {sessionStatus === 'connected' ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-green-50 border border-green-100 rounded-lg p-5">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mr-4 border-2 border-green-200">
                    <SmartphoneIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center mb-1"><span className="flex h-2.5 w-2.5 bg-whatsapp rounded-full mr-2"></span><h3 className="font-semibold text-green-800">Connected</h3></div>
                    {waProfile && (
                      <>
                        <p className="text-sm font-medium text-green-900">{waProfile.name}</p>
                        <p className="text-sm text-green-700 font-mono">+{waProfile.number}</p>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="mt-4 md:mt-0 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center cursor-pointer disabled:opacity-50"
                >
                  {disconnecting ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <ShieldAlertIcon className="w-4 h-4 mr-2" />}
                  Disconnect Device
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div>
                  <div className="flex items-center mb-1"><span className="flex h-2.5 w-2.5 bg-gray-400 rounded-full mr-2"></span><h3 className="font-semibold text-gray-700">Disconnected</h3></div>
                  <p className="text-sm text-gray-500">Connect your WhatsApp to start sending campaigns.</p>
                </div>
                <button onClick={() => router.push('/dashboard')} className="mt-4 md:mt-0 px-4 py-2 bg-whatsapp text-white rounded-lg text-sm font-medium hover:bg-whatsapp-hover transition-colors cursor-pointer">Go to Dashboard to Connect</button>
              </div>
            )}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center bg-gray-50">
            <LockIcon className="w-5 h-5 text-gray-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Current Password">
                <input type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setPasswordErrors(p => ({ ...p, currentPassword: '' })) }} placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none ${passwordErrors.currentPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                {passwordErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword}</p>}
              </FormField>
              <div className="hidden md:block"></div>
              <FormField label="New Password">
                <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors(p => ({ ...p, newPassword: '' })) }} placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none ${passwordErrors.newPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                {passwordErrors.newPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword}</p>}
              </FormField>
              <FormField label="Confirm New Password">
                <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors(p => ({ ...p, confirmPassword: '' })) }} placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none ${passwordErrors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                {passwordErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>}
              </FormField>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleChangePassword}
                disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {savingPassword && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
