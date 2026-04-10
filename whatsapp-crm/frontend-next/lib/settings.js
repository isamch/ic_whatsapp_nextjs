import api from './api'

export const updateProfile   = (data)                         => api.patch('/settings/profile', data)
export const changePassword  = (currentPassword, newPassword) => api.patch('/settings/password', { currentPassword, newPassword })
