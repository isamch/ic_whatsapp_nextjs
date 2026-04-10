'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, Trash2Icon, ShieldIcon, UserIcon, Loader2Icon, PowerIcon, XIcon, EyeIcon, EyeOffIcon, RefreshCwIcon } from 'lucide-react'
import { SearchInput } from '@/components/ui'
import { useAlert } from '@/context/AlertContext'
import { useApp } from '@/context/AppContext'
import { getUsers, createUser, deleteUser, toggleStatus } from '@/lib/users'
import { validateCreateUser, getPasswordStrength, generatePassword } from '@/lib/validations/user/createUser.validation'

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

function CreateUserForm({ form, setForm, onSubmit, saving, onClose }) {
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = () => {
    const e = validateCreateUser(form)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    onSubmit()
  }

  const handleGenerate = () => {
    setForm(p => ({ ...p, password: generatePassword() }))
    setShowPassword(true)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })) }}
            placeholder="John Doe"
            className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
        </div>
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
        <input value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
          placeholder="john@example.com" type="email"
          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Password</label>
          <button type="button" onClick={handleGenerate}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
            <RefreshCwIcon className="w-3 h-3" /> Generate
          </button>
        </div>
        <div className="relative">
          <input value={form.password} onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })) }}
            placeholder="Min. 8 characters" type={showPassword ? 'text' : 'password'}
            className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 font-mono ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
          <button type="button" onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
            {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        {form.password && (() => {
          const { score, label, color } = getPasswordStrength(form.password)
          return (
            <div className="mt-1.5 flex items-center gap-1">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? color : 'bg-gray-200'}`} />
              ))}
              <span className="text-[10px] text-gray-400 ml-1 w-12">{label}</span>
            </div>
          )
        })()}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
        <div className="grid grid-cols-2 gap-3">
          {['user', 'admin'].map(role => (
            <button key={role} type="button" onClick={() => setForm(p => ({ ...p, roles: [role] }))}
              className={`py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                form.roles[0] === role
                  ? role === 'admin' ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-gray-900 border-gray-900 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
              {role === 'admin' ? <ShieldIcon className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
          {saving && <Loader2Icon className="w-4 h-4 animate-spin" />} Create User
        </button>
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [createModal, setCreateModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving]           = useState(false)
  const [form, setForm]               = useState({ name: '', email: '', password: '', roles: ['user'] })
  const { showAlert } = useAlert()
  const { user: currentUser } = useApp()

  const fetchUsers = () => {
    getUsers()
      .then(res => setUsers(res.data?.users || []))
      .catch(() => showAlert('Failed to load users', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return showAlert('Please fill all fields', 'error')
    setSaving(true)
    try {
      await createUser(form)
      showAlert('User created', 'success')
      setCreateModal(false)
      setForm({ name: '', email: '', password: '', roles: ['user'] })
      fetchUsers()
    } catch (err) { showAlert(err.message || 'Failed to create user', 'error') }
    finally { setSaving(false) }
  }

  const handleToggleStatus = async (user) => {
    try {
      await toggleStatus(user._id)
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u))
      showAlert(`User ${user.isActive ? 'deactivated' : 'activated'}`, 'success')
    } catch { showAlert('Failed to update status', 'error') }
  }

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget._id)
      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id))
      showAlert('User deleted', 'success')
    } catch { showAlert('Failed to delete user', 'error') }
    finally { setDeleteTarget(null) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage platform access and user accounts.</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-sm cursor-pointer">
          <PlusIcon className="w-5 h-5 mr-2" /> Create User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search users..." className="w-80" />
          <span className="text-sm text-gray-500">Total: <span className="font-semibold text-gray-900">{users.length}</span></span>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.roles?.includes('admin') ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                          <ShieldIcon className="w-3 h-3 mr-1" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          <UserIcon className="w-3 h-3 mr-1" /> User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggleStatus(user)}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                          disabled={user._id === currentUser?._id}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${user.isActive ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}>
                          <PowerIcon className="w-4 h-4" />
                        </button>
                        {!user.roles?.includes('admin') && (
                          <button onClick={() => setDeleteTarget(user)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer">
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {createModal && (
        <Modal title="Create New User" onClose={() => setCreateModal(false)}>
          <CreateUserForm
            form={form}
            setForm={setForm}
            onSubmit={handleCreate}
            saving={saving}
            onClose={() => setCreateModal(false)}
          />
        </Modal>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2Icon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-500 mt-0.5">Delete <span className="font-medium text-gray-700">{deleteTarget.name}</span>? This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium cursor-pointer">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
