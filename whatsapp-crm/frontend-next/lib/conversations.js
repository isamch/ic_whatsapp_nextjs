import api from './api'

export const getConversations = ()              => api.get('/whatsapp/conversations')
export const getContactConversations = (params) => {
  const q = new URLSearchParams(params).toString()
  return api.get(`/conversations/contacts${q ? `?${q}` : ''}`)
}
export const getMessages      = (chatId)        => api.get(`/whatsapp/conversations/${chatId}/messages`)
export const sendMessage      = (chatId, body)  => api.post(`/whatsapp/conversations/${chatId}/messages`, { body })
