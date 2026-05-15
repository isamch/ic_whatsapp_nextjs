import api from './api'

export const connectWhatsapp    = () => api.post('/whatsapp/connect')
export const getWhatsappQR      = () => api.get('/whatsapp/qr')
export const getWhatsappStatus  = () => api.get('/whatsapp/status')
export const getWhatsappProfile = () => api.get('/whatsapp/profile')
export const disconnectWhatsapp = () => api.post('/whatsapp/disconnect')
