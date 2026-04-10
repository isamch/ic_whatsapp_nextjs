import api from './api'

export const getTemplates   = (page = 1, limit = 100) => api.get(`/templates?page=${page}&limit=${limit}`)
export const createTemplate = (data)      => api.post('/templates', data)
export const updateTemplate = (id, data)  => api.patch(`/templates/${id}`, data)
export const deleteTemplate = (id)        => api.delete(`/templates/${id}`)
