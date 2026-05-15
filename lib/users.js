import api from './api'

export const getUsers        = (page = 1, limit = 100) => api.get(`/users?page=${page}&limit=${limit}`)
export const getUserById     = (id)                     => api.get(`/users/${id}`)
export const createUser      = (data)                   => api.post('/users', data)
export const updateUser      = (id, data)               => api.patch(`/users/${id}`, data)
export const deleteUser      = (id)                     => api.delete(`/users/${id}`)
export const toggleStatus    = (id)                     => api.patch(`/users/${id}/toggle-status`)
