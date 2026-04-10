import api from './api'

export const getConversations = ()              => api.get('/whatsapp/conversations')
export const getMessages      = (chatId)        => api.get(`/whatsapp/conversations/${chatId}/messages`)
export const sendMessage      = (chatId, body)  => api.post(`/whatsapp/conversations/${chatId}/messages`, { body })
