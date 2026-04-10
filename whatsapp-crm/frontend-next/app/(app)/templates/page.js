'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, SearchIcon, CopyIcon, EditIcon, Trash2Icon, MessageSquareIcon, AlertCircleIcon, BookOpenIcon, Loader2Icon } from 'lucide-react'
import { SearchInput } from '@/components/ui'
import { useAlert } from '@/context/AlertContext'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/lib/templates'
import { validateCreateTemplate } from '@/lib/validations/template/createTemplate.validation'
import { validateUpdateTemplate } from '@/lib/validations/template/updateTemplate.validation'
import WhatsAppRequired from '@/components/WhatsAppRequired'

export default function TemplatesPage() {
  const [templates, setTemplates]           = useState([])
  const [loading, setLoading]               = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isEditing, setIsEditing]           = useState(false)
  const [saving, setSaving]                 = useState(false)
  const [deleteTarget, setDeleteTarget]     = useState(null)
  const [searchQuery, setSearchQuery]       = useState('')
  const [name, setName]                     = useState('')
  const [body, setBody]                     = useState('')
  const [errors, setErrors]                 = useState({})
  const { showAlert } = useAlert()

  useEffect(() => {
    getTemplates(1, 100)
      .then(res => setTemplates(res.data?.data || []))
      .catch(() => showAlert('Failed to load templates', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const filteredTemplates = templates.filter(
    t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         t.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setName(template.name)
    setBody(template.body)
    setIsEditing(true)
  }

  const DRAFT_ID = '__draft__'

  const handleNewTemplate = () => {
    const draft = { _id: DRAFT_ID, name: 'Untitled Template', body: '', variables: [], createdAt: new Date().toISOString() }
    setTemplates(prev => prev.some(t => t._id === DRAFT_ID) ? prev : [draft, ...prev])
    setSelectedTemplate(draft)
    setName('Untitled Template')
    setBody('')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTemplates(prev => prev.filter(t => t._id !== DRAFT_ID))
    setIsEditing(false)
    setSelectedTemplate(null)
    setName('')
    setBody('')
    setErrors({})
  }

  const handleSave = async () => {
    const errs = selectedTemplate && selectedTemplate._id !== DRAFT_ID
      ? validateUpdateTemplate({ name: name.trim(), body: body.trim() })
      : validateCreateTemplate({ name: name.trim(), body: body.trim() })
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    try {
      const finalName = name.trim()
      const finalBody = body.trim()
      if (selectedTemplate && selectedTemplate._id !== DRAFT_ID) {
        const res = await updateTemplate(selectedTemplate._id, { name: finalName, body: finalBody })
        setTemplates(prev => prev.map(t => t._id === selectedTemplate._id ? res.data.template : t))
        setSelectedTemplate(res.data.template)
        showAlert('Template updated', 'success')
      } else {
        const res = await createTemplate({ name: finalName, body: finalBody })
        setTemplates(prev => prev.map(t => t._id === DRAFT_ID ? res.data.template : t))
        setSelectedTemplate(res.data.template)
        showAlert('Template created', 'success')
      }
      setIsEditing(false)
    } catch (err) {
      showAlert(err.message || 'Failed to save template', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDuplicate = async (t, e) => {
    e.stopPropagation()
    try {
      const res = await createTemplate({ name: `${t.name} (copy)`, body: t.body })
      setTemplates(prev => [res.data.template, ...prev])
      showAlert('Template duplicated', 'success')
    } catch {
      showAlert('Failed to duplicate', 'error')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteTemplate(deleteTarget._id)
      setTemplates(prev => prev.filter(t => t._id !== deleteTarget._id))
      if (selectedTemplate?._id === deleteTarget._id) handleCancel()
      showAlert('Template deleted', 'success')
    } catch {
      showAlert('Failed to delete', 'error')
    } finally {
      setDeleteTarget(null)
    }
  }

  const insertVariable = (variable) => setBody(prev => prev + `{{${variable}}}`)

  const generatePreview = (text) =>
    text
      .replace(/\{\{name\}\}/g, 'John Doe')
      .replace(/\{\{company\}\}/g, 'Acme Corp')
      .replace(/\{\{offer\}\}/g, '20% OFF')
      .replace(/\{\{discount\}\}/g, '20%')
      .replace(/\{\{code\}\}/g, 'SAVE20')
      .replace(/\{\{topic\}\}/g, 'Future of AI')
      .replace(/\{\{link\}\}/g, 'https://zoom.us/j/123')
      .replace(/\{\{plan\}\}/g, 'Pro Tier')
      .replace(/\{\{[^}]+\}\}/g, '[Value]')

  return (
    <WhatsAppRequired>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex p-6 gap-6 overflow-hidden">

      {/* Template List */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Message Templates</h2>
          <button onClick={handleNewTemplate} className="p-2 bg-whatsapp text-white rounded-lg hover:bg-whatsapp-hover transition-colors shadow-sm cursor-pointer">
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-100">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search templates..." />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <BookOpenIcon className="w-10 h-10 mb-2 text-gray-300" />
              <p className="text-sm">{searchQuery ? 'No templates found' : 'No templates yet'}</p>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <div
                key={template._id}
                onClick={() => handleSelectTemplate(template)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedTemplate?._id === template._id ? 'bg-green-50 border-l-4 border-l-whatsapp' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={e => handleDuplicate(template, e)}
                      className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
                      title="Duplicate"
                    >
                      <CopyIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteTarget(template) }}
                      className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2Icon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{template.body}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 mr-2">{template.variables?.length || 0} variables</span>
                  <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-w-0 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isEditing ? (
          <>
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">{selectedTemplate ? 'Edit Template' : 'Create New Template'}</h2>
              <div className="flex space-x-3">
                <button onClick={handleCancel} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-whatsapp text-white rounded-lg text-sm font-medium hover:bg-whatsapp-hover transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader2Icon className="w-4 h-4 animate-spin" />}
                  Save Template
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="e.g., Welcome Message"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    onChange={e => {
                      setName(e.target.value)
                      setErrors(p => ({ ...p, name: '' }))
                      setTemplates(prev => prev.map(t => t._id === selectedTemplate?._id ? { ...t, name: e.target.value } : t))
                    }}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-medium text-gray-700">Message Body</label>
                    <span className="text-xs text-gray-500">{body.length} / 1024 chars</span>
                  </div>
                  <textarea
                    value={body}
                    onChange={e => { setBody(e.target.value); setErrors(p => ({ ...p, body: '' })) }}
                    rows={8}
                    placeholder="Type your message here..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp resize-none font-sans ${errors.body ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insert Variables</label>
                  <div className="flex flex-wrap gap-2">
                    {['name', 'company', 'offer', 'link'].map(v => (
                      <button key={v} onClick={() => insertVariable(v)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md text-sm font-mono text-gray-700 transition-colors cursor-pointer">
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-start">
                    <AlertCircleIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                    Variables will be replaced with actual contact data when sending campaigns.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col">
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                  <MessageSquareIcon className="w-4 h-4 mr-2" /> Live Preview
                </h3>
                <div className="flex-1 bg-[#efeae2] rounded-lg border border-gray-300 overflow-hidden relative flex flex-col p-4 shadow-inner">
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")' }} />
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%] relative z-10 self-start rounded-tl-none mt-2">
                    <div className="absolute top-0 -left-2 w-3 h-3 bg-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                    <p className="text-[15px] text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {body ? generatePreview(body) : <span className="text-gray-400 italic">Start typing to see preview...</span>}
                    </p>
                    <div className="text-right mt-1"><span className="text-[10px] text-gray-400">12:00 PM</span></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg">Select a template to edit or create a new one.</p>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2Icon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete Template</h3>
                <p className="text-sm text-gray-500 mt-0.5">Are you sure you want to delete "{deleteTarget.name}"?</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium cursor-pointer">
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
    </WhatsAppRequired>
  )
}
