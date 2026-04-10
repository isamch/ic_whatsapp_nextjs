'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon, PlayIcon, PauseIcon, SquareIcon,
  ChevronRightIcon, Loader2Icon, Trash2Icon, EditIcon, MoreVerticalIcon, RotateCcwIcon, AlertTriangleIcon,
} from 'lucide-react'
import { Badge, SearchInput, PageHeader } from '@/components/ui'
import WhatsAppRequired from '@/components/WhatsAppRequired'
import { useAlert } from '@/context/AlertContext'
import { getTemplates } from '@/lib/templates'
import { getLists, getCategories } from '@/lib/contacts'
import {
  getCampaigns, getCampaignById, createCampaign, updateCampaign, deleteCampaign,
  runCampaign, pauseCampaign, resumeCampaign, stopCampaign,
  getCampaignLogs, resetCampaign,
} from '@/lib/campaigns'
import { validateCreateCampaign } from '@/lib/validations/campaign/createCampaign.validation'
import { validateUpdateCampaign } from '@/lib/validations/campaign/updateCampaign.validation'

const TABS = ['all', 'draft', 'running', 'paused', 'completed', 'stopped']

export default function CampaignsPage() {
  const [campaigns, setCampaigns]         = useState([])
  const [loading, setLoading]             = useState(true)
  const [activeTab, setActiveTab]         = useState('all')
  const [search, setSearch]               = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isCreating, setIsCreating]       = useState(false)
  const { showAlert } = useAlert()

  const fetchCampaigns = async (tab = activeTab) => {
    setLoading(true)
    try {
      const params = { limit: 100 }
      if (tab !== 'all') params.status = tab
      const res = await getCampaigns(params)
      setCampaigns(res.data?.data || [])
    } catch {
      showAlert('Failed to load campaigns', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCampaigns(activeTab) }, [activeTab])

  const handleTabChange = (tab) => { setActiveTab(tab); setSearch('') }

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  if (selectedCampaign) return (
    <CampaignDetail
      campaignId={selectedCampaign}
      onBack={() => { setSelectedCampaign(null); fetchCampaigns() }}
      showAlert={showAlert}
    />
  )

  if (isCreating) return (
    <CampaignCreate
      onCancel={() => setIsCreating(false)}
      onCreated={() => { setIsCreating(false); fetchCampaigns() }}
      showAlert={showAlert}
    />
  )

  return (
    <WhatsAppRequired>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full flex flex-col overflow-hidden">
        <PageHeader
          title="Campaigns"
          description="Manage and track your bulk messaging campaigns."
          action={
            <button onClick={() => setIsCreating(true)} className="bg-whatsapp hover:bg-whatsapp-hover text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-sm cursor-pointer">
              <PlusIcon className="w-5 h-5 mr-2" /> New Campaign
            </button>
          }
        />

        <div className="bg-white border-b border-gray-200 rounded-t-xl px-4 flex space-x-1 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className={`py-4 px-3 font-medium text-sm border-b-2 transition-colors capitalize whitespace-nowrap cursor-pointer ${activeTab === tab ? 'border-whatsapp text-whatsapp' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between bg-gray-50/50">
            <SearchInput value={search} onChange={setSearch} placeholder="Search campaigns..." className="w-72" />
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2Icon className="w-6 h-6 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-sm">{search ? 'No campaigns found' : 'No campaigns yet'}</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {['Campaign Name', 'Status', 'Progress', 'Sent / Failed', 'Date', 'Action'].map(h => (
                      <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'Action' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map(campaign => {
                    const progress = campaign.total > 0 ? campaign.sent / campaign.total * 100 : 0
                    const failedPct = campaign.total > 0 ? campaign.failed / campaign.total * 100 : 0
                    return (
                      <tr key={campaign._id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedCampaign(campaign._id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{campaign.listId?.name || '—'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"><Badge status={campaign.status} /></td>
                        <td className="px-6 py-4 whitespace-nowrap w-48">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div className="flex h-full">
                                <div className={`h-full transition-all duration-500 ${
                                  campaign.status === 'running'   ? 'bg-emerald-500' :
                                  campaign.status === 'completed' ? 'bg-blue-500' :
                                  campaign.status === 'paused'    ? 'bg-amber-400' :
                                  campaign.status === 'stopped'   ? 'bg-red-400' :
                                  'bg-gray-300'
                                }`} style={{ width: `${progress}%` }} />
                                {failedPct > 0 && (
                                  <div className="h-full bg-red-300 transition-all duration-500" style={{ width: `${failedPct}%` }} />
                                )}
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-500 w-8 text-right">{Math.round(progress + failedPct)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-green-600 font-medium">{campaign.sent}</span> / <span className="text-red-500">{campaign.failed}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.startedAt ? new Date(campaign.startedAt).toLocaleDateString() : campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 group-hover:text-whatsapp transition-colors cursor-pointer">
                            <ChevronRightIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>
    </WhatsAppRequired>
  )
}

function CampaignDetail({ campaignId, onBack, showAlert }) {
  const [campaign, setCampaign]   = useState(null)
  const [logs, setLogs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [acting, setActing]       = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const pollRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchCampaign = async () => {
    try {
      const res = await getCampaignById(campaignId)
      setCampaign(res.data)
    } catch { showAlert('Failed to load campaign', 'error') }
  }

  const fetchLogs = async () => {
    try {
      const res = await getCampaignLogs(campaignId)
      setLogs(res.data?.data || [])
    } catch {}
  }

  useEffect(() => {
    Promise.all([fetchCampaign(), fetchLogs()]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!campaign) return
    if (campaign.status === 'running') {
      pollRef.current = setInterval(() => { fetchCampaign(); fetchLogs() }, 3000)
    } else {
      clearInterval(pollRef.current)
    }
    return () => clearInterval(pollRef.current)
  }, [campaign?.status])

  const handleAction = async (action, extra) => {
    setActing(action)
    try {
      if (action === 'run')      await runCampaign(campaignId)
      if (action === 'pause')    await pauseCampaign(campaignId)
      if (action === 'resume')   await resumeCampaign(campaignId)
      if (action === 'stop')     await stopCampaign(campaignId)
      if (action === 'delete')   { await deleteCampaign(campaignId); showAlert('Campaign deleted', 'success'); onBack(); return }
      if (action === 'reset') {
        const res = await resetCampaign(campaignId)
        setCampaign(res.data)
        setLogs([])
        showAlert('Campaign reset', 'success')
        return
      }
      await fetchCampaign()
      if (action !== 'run') showAlert(`Campaign ${action}${action === 'pause' ? 'd' : 'ed'}`, 'success')
    } catch (err) {
      showAlert(err.message || `Failed to ${action}`, 'error')
    } finally {
      setActing(false)
      setDeleteConfirm(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400"><Loader2Icon className="w-6 h-6 animate-spin" /></div>
  if (!campaign) return null

  const sentPct   = campaign.total > 0 ? campaign.sent   / campaign.total * 100 : 0
  const failedPct  = campaign.total > 0 ? campaign.failed / campaign.total * 100 : 0
  const progress   = sentPct + failedPct

  const barColor =
    campaign.status === 'running'   ? 'bg-emerald-500' :
    campaign.status === 'completed' ? 'bg-blue-500' :
    campaign.status === 'paused'    ? 'bg-amber-400' :
    campaign.status === 'stopped'   ? 'bg-red-400' :
    'bg-gray-300'
  const isDraft = campaign.status === 'draft'
  const isRunning = campaign.status === 'running'
  const isPaused = campaign.status === 'paused'
  const isDone = ['completed', 'stopped'].includes(campaign.status)

  if (isEditing) return (
    <CampaignEdit
      campaign={campaign}
      onCancel={() => setIsEditing(false)}
      onSaved={() => { setIsEditing(false); fetchCampaign() }}
      showAlert={showAlert}
    />
  )

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl w-full mx-auto">

        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium transition-colors cursor-pointer">
            <ChevronRightIcon className="w-4 h-4 mr-1 rotate-180" /> Back to Campaigns
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{campaign.name}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge status={campaign.status} />
              </div>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-400">
                <span>{campaign.templateId?.name}</span>
                <span>•</span>
                <span>{campaign.listId?.name} ({campaign.listId?.contactCount} contacts)</span>
                <span>•</span>
                <span>{campaign.ratePerMinute} msgs/min</span>
                {campaign.startedAt && <><span>•</span><span>Started: {new Date(campaign.startedAt).toLocaleString()}</span></>}
                {campaign.scheduledAt && <><span>•</span><span>Scheduled: {new Date(campaign.scheduledAt).toLocaleString()}</span></>}
                <span>•</span>
                <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions + 3-dots */}
            <div className="flex items-center gap-2">
              {isRunning && (
                <>
                  <button onClick={() => handleAction('pause')} disabled={!!acting}
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium flex items-center hover:bg-amber-200 transition-colors cursor-pointer disabled:opacity-50">
                    {acting === 'pause' ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <PauseIcon className="w-4 h-4 mr-2" />} Pause
                  </button>
                  <button onClick={() => handleAction('stop')} disabled={!!acting}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium flex items-center hover:bg-red-200 transition-colors cursor-pointer disabled:opacity-50">
                    <SquareIcon className="w-4 h-4 mr-2" /> Stop
                  </button>
                </>
              )}
              {isPaused && (
                <>
                  <button onClick={() => handleAction('resume')} disabled={!!acting}
                    className="px-4 py-2 bg-whatsapp text-white rounded-lg font-medium flex items-center hover:bg-whatsapp-hover transition-colors cursor-pointer disabled:opacity-50">
                    {acting === 'resume' ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <PlayIcon className="w-4 h-4 mr-2" />} Resume
                  </button>
                  <button onClick={() => handleAction('stop')} disabled={!!acting}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium flex items-center hover:bg-red-200 transition-colors cursor-pointer disabled:opacity-50">
                    <SquareIcon className="w-4 h-4 mr-2" /> Stop
                  </button>
                </>
              )}

              {/* 3-dots menu */}
              <div ref={menuRef} className="relative">
                <button onClick={() => setMenuOpen(o => !o)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <MoreVerticalIcon className="w-5 h-5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                    {isDraft && (
                      <>
                        <button onClick={() => { setIsEditing(true); setMenuOpen(false) }}
                          className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                          <EditIcon className="w-4 h-4 text-gray-400" /> Edit
                        </button>
                        <button onClick={() => { handleAction('run'); setMenuOpen(false) }} disabled={!!acting}
                          className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 cursor-pointer disabled:opacity-50">
                          {acting === 'run' ? <Loader2Icon className="w-4 h-4 text-gray-400 animate-spin" /> : <PlayIcon className="w-4 h-4 text-whatsapp" />} Run Now
                        </button>
                      </>
                    )}
                    {isRunning && (
                      <>
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => { handleAction('stop'); setMenuOpen(false) }} disabled={!!acting}
                          className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 cursor-pointer disabled:opacity-50">
                          <SquareIcon className="w-4 h-4" /> Stop
                        </button>
                      </>
                    )}
                    {isPaused && (
                      <>
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => { handleAction('stop'); setMenuOpen(false) }} disabled={!!acting}
                          className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 cursor-pointer disabled:opacity-50">
                          <SquareIcon className="w-4 h-4" /> Stop
                        </button>
                      </>
                    )}
                    {(isDraft || isDone) && (
                      <>
                        <div className="border-t border-gray-100 my-1" />
                        {isDone && (
                          <button onClick={() => { handleAction('reset'); setMenuOpen(false) }} disabled={!!acting}
                            className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 cursor-pointer disabled:opacity-50">
                            <RotateCcwIcon className="w-4 h-4 text-blue-400" /> Reset
                          </button>
                        )}
                        <button onClick={() => { setDeleteConfirm(true); setMenuOpen(false) }}
                          className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 cursor-pointer">
                          <Trash2Icon className="w-4 h-4" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-bold text-gray-900">{campaign.sent + campaign.failed} / {campaign.total} <span className="text-gray-400 font-normal">({Math.round(progress)}%)</span></span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-4">
              <div className="flex h-full">
                <div className={`h-full transition-all duration-500 ${barColor}`} style={{ width: `${sentPct}%` }} />
                {failedPct > 0 && <div className="h-full bg-red-300 transition-all duration-500" style={{ width: `${failedPct}%` }} />}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Status',  value: campaign.status,  cls: 'bg-gray-50 border-gray-100',   vCls: 'text-gray-700 capitalize text-base' },
                { label: 'Sent',    value: campaign.sent,    cls: 'bg-green-50 border-green-100', vCls: 'text-green-700' },
                { label: 'Failed',  value: campaign.failed,  cls: 'bg-red-50 border-red-100',     vCls: 'text-red-600' },
                { label: 'Pending', value: Math.max(0, campaign.total - campaign.sent - campaign.failed), cls: 'bg-gray-50 border-gray-100', vCls: 'text-gray-900' },
              ].map(({ label, value, cls, vCls }) => (
                <div key={label} className={`rounded-lg p-4 border ${cls}`}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{label}</p>
                  <p className={`text-2xl font-bold ${vCls}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Delivery Log</h3>
          </div>
          {logs.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">No logs yet</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white sticky top-0">
                <tr>{['Contact', 'Phone', 'Status', 'Time'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map(log => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{log.contactId?.name || '—'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500 font-mono">{log.phone}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{new Date(log.sentAt || log.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setDeleteConfirm(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2Icon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete Campaign</h3>
                <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={() => handleAction('delete')} disabled={!!acting}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                {acting === 'delete' && <Loader2Icon className="w-4 h-4 animate-spin" />} Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Schedule Modal removed */}
    </motion.div>
  )
}

function CampaignEdit({ campaign, onCancel, onSaved, showAlert }) {
  const [templates, setTemplates]   = useState([])
  const [lists, setLists]           = useState([])
  const [categories, setCategories] = useState([])
  const [name, setName]             = useState(campaign.name)
  const [templateId, setTemplateId] = useState(campaign.templateId?._id || '')
  const [listId, setListId]         = useState(campaign.listId?._id || '')
  const [rate, setRate]             = useState(campaign.ratePerMinute)
  const [saving, setSaving]         = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errors, setErrors]         = useState({})

  useEffect(() => {
    Promise.all([getTemplates(), getLists(), getCategories()])
      .then(([tRes, lRes, cRes]) => {
        setTemplates(tRes.data?.data || [])
        setLists(lRes.data?.lists || [])
        setCategories(cRes.data?.categories || [])
      })
      .catch(() => showAlert('Failed to load data', 'error'))
      .finally(() => setLoadingData(false))
  }, [])

  const handleSave = async () => {
    const errs = validateUpdateCampaign({ name: name.trim(), templateId, listId, ratePerMinute: rate })
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    try {
      await updateCampaign(campaign._id, { name: name.trim(), templateId, listId, ratePerMinute: rate })
      showAlert('Campaign updated', 'success')
      onSaved()
    } catch (err) {
      showAlert(err.message || 'Failed to update campaign', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl w-full mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Edit Campaign</h2>
            <p className="text-sm text-gray-500 mt-1">Only draft campaigns can be edited.</p>
          </div>
          {loadingData ? (
            <div className="flex items-center justify-center py-16 text-gray-400"><Loader2Icon className="w-6 h-6 animate-spin" /></div>
          ) : (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input type="text" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <select value={templateId} onChange={e => { setTemplateId(e.target.value); setErrors(p => ({ ...p, templateId: '' })) }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none bg-white ${errors.templateId ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                    <option value="">Choose a template...</option>
                    {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                  {errors.templateId && <p className="text-xs text-red-500 mt-1">{errors.templateId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact List</label>
                  <ListSelect lists={lists} categories={categories} value={listId} onChange={v => { setListId(v); setErrors(p => ({ ...p, listId: '' })) }} />
                  {errors.listId && <p className="text-xs text-red-500 mt-1">{errors.listId}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sending Speed — <span className="text-whatsapp font-semibold">{rate} msgs/min</span>
                </label>
                <input type="range" min="1" max="60" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-whatsapp" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>60</span></div>
              </div>
            </div>
          )}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <button onClick={onCancel} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button disabled={saving || loadingData} onClick={handleSave}
              className="px-5 py-2.5 bg-whatsapp text-white rounded-lg font-medium hover:bg-whatsapp-hover transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50">
              {saving && <Loader2Icon className="w-4 h-4 animate-spin" />} Save Changes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ListSelect({ lists, categories, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = lists.find(l => l._id === value)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const grouped = categories.map(cat => ({
    ...cat,
    items: lists.filter(l => l.categoryId?.toString() === cat._id?.toString())
  })).filter(g => g.items.length)

  const uncategorized = lists.filter(l => !l.categoryId || !categories.find(c => c._id?.toString() === l.categoryId?.toString()))

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none">
        {selected
          ? <span className="text-sm text-gray-900">{selected.name} <span className="text-gray-400">({selected.contactCount} contacts)</span></span>
          : <span className="text-sm text-gray-400">Choose a list...</span>
        }
        <ChevronRightIcon className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-90' : 'rotate-90 -rotate-0'}`} style={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
          <div onClick={() => { onChange(''); setOpen(false) }}
            className="px-4 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer">
            Choose a list...
          </div>

          {grouped.map(group => (
            <div key={group._id}>
              <div className="px-3 py-1 text-[10px] font-semibold text-gray-400/70 uppercase tracking-widest bg-gray-50/80 border-y border-gray-100">
                {group.name}
              </div>
              {group.items.map(l => (
                <div key={l._id} onClick={() => { onChange(l._id); setOpen(false) }}
                  className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-green-50 hover:text-whatsapp transition-colors ${
                    value === l._id ? 'bg-green-50 text-whatsapp font-medium' : 'text-gray-700'
                  }`}>
                  <span>{l.name}</span>
                  <span className="text-xs text-gray-400">{l.contactCount} contacts</span>
                </div>
              ))}
            </div>
          ))}

          {uncategorized.map(l => (
            <div key={l._id} onClick={() => { onChange(l._id); setOpen(false) }}
              className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-green-50 hover:text-whatsapp transition-colors ${
                value === l._id ? 'bg-green-50 text-whatsapp font-medium' : 'text-gray-700'
              }`}>
              <span>{l.name}</span>
              <span className="text-xs text-gray-400">{l.contactCount} contacts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CampaignCreate({ onCancel, onCreated, showAlert }) {
  const [templates, setTemplates]   = useState([])
  const [lists, setLists]           = useState([])
  const [categories, setCategories] = useState([])
  const [name, setName]             = useState('')
  const [templateId, setTemplateId] = useState('')
  const [listId, setListId]         = useState('')
  const [rate, setRate]             = useState(15)
  const [saving, setSaving]         = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errors, setErrors]         = useState({})

  useEffect(() => {
    Promise.all([getTemplates(), getLists(), getCategories()])
      .then(([tRes, lRes, cRes]) => {
        setTemplates(tRes.data?.data || [])
        setLists(lRes.data?.lists || [])
        setCategories(cRes.data?.categories || [])
      })
      .catch(() => showAlert('Failed to load data', 'error'))
      .finally(() => setLoadingData(false))
  }, [])

  const handleSubmit = async () => {
    const errs = validateCreateCampaign({ name: name.trim(), templateId, listId, ratePerMinute: rate })
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    try {
      await createCampaign({ name: name.trim(), templateId, listId, ratePerMinute: rate })
      showAlert('Campaign saved', 'success')
      onCreated()
    } catch (err) {
      showAlert(err.message || 'Failed to create campaign', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl w-full mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Create New Campaign</h2>
            <p className="text-sm text-gray-500 mt-1">Configure your bulk message broadcast.</p>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                  placeholder="e.g., Spring Promo 2026"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Template</label>
                  <select value={templateId} onChange={e => { setTemplateId(e.target.value); setErrors(p => ({ ...p, templateId: '' })) }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none bg-white ${errors.templateId ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                    <option value="">Choose a template...</option>
                    {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                  {errors.templateId && <p className="text-xs text-red-500 mt-1">{errors.templateId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Contact List</label>
                  <ListSelect lists={lists} categories={categories} value={listId} onChange={v => { setListId(v); setErrors(p => ({ ...p, listId: '' })) }} />
                  {errors.listId && <p className="text-xs text-red-500 mt-1">{errors.listId}</p>}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start">
                <AlertTriangleIcon className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700">Slower speeds reduce the risk of WhatsApp bans. Recommended: 10–20 msgs/min.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sending Speed — <span className="text-whatsapp font-semibold">{rate} msgs/min</span>
                </label>
                <input type="range" min="1" max="60" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-whatsapp" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>60</span></div>
              </div>
            </div>
          )}

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <button onClick={onCancel} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button disabled={saving || loadingData} onClick={handleSubmit}
              className="px-5 py-2.5 bg-whatsapp text-white rounded-lg font-medium hover:bg-whatsapp-hover transition-colors shadow-sm flex items-center cursor-pointer disabled:opacity-50">
              {saving ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : null} Save Campaign
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
