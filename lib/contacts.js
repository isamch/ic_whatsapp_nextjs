import api from './api'
import { getAccessToken } from './auth'

// ─── Categories ──────────────────────────────────────────────────
export const getCategories    = ()          => api.get('/categories')
export const createCategory   = (data)      => api.post('/categories', data)
export const updateCategory   = (id, data)  => api.patch(`/categories/${id}`, data)
export const deleteCategory   = (id)        => api.delete(`/categories/${id}`)

// ─── Contact Lists ───────────────────────────────────────────────
export const getLists         = (catId)     => api.get(`/contact-lists${catId ? `?categoryId=${catId}` : ''}`)
export const createList       = (data)      => api.post('/contact-lists', data)
export const updateList       = (id, data)  => api.patch(`/contact-lists/${id}`, data)
export const deleteList       = (id)        => api.delete(`/contact-lists/${id}`)

// ─── Contacts ────────────────────────────────────────────────────
export const getContacts      = (listId, page = 1, limit = 50) => api.get(`/contacts?listId=${listId}&page=${page}&limit=${limit}`)
export const createContact    = (data)      => api.post('/contacts', data)
export const updateContact    = (id, data)  => api.patch(`/contacts/${id}`, data)
export const deleteContact    = (id)        => api.delete(`/contacts/${id}`)

// ─── Bulk Actions ────────────────────────────────────────────────
export const validateContacts = (listId)    => api.post(`/contacts/validate?listId=${listId}`)
export const clearInvalid     = (listId)    => api.delete(`/contacts/clear-invalid?listId=${listId}`)

// ─── CSV Import (multipart) ──────────────────────────────────────
export const importContacts = (listId, file) => {
  const form = new FormData()
  form.append('file', file)
  form.append('listId', listId)

  return fetch(`/api/contacts/import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    body: form,
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) {
      const err = new Error(data?.message || 'Import failed')
      err.response = { status: res.status, data }
      throw err
    }
    return data
  })
}
export const syncContacts = () => api.post('/whatsapp/sync')
