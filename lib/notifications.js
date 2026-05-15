import api from './api'

export const getInbox        = (page = 1, limit = 20) => api.get(`/notifications/inbox?page=${page}&limit=${limit}`)
export const getUnreadCount  = ()                      => api.get('/notifications/unread-count')
export const markAsRead      = (id)                    => api.patch(`/notifications/${id}/read`)
export const markAllAsRead   = ()                      => api.patch('/notifications/read-all')
export const deleteNotif     = (id)                    => api.delete(`/notifications/${id}`)
