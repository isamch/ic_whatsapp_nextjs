import api from './api'

export const getCampaigns      = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return api.get(`/campaigns${q ? `?${q}` : ''}`)
}
export const getCampaignById   = (id)          => api.get(`/campaigns/${id}`)
export const createCampaign    = (data)        => api.post('/campaigns', data)
export const updateCampaign    = (id, data)    => api.patch(`/campaigns/${id}`, data)
export const deleteCampaign    = (id)          => api.delete(`/campaigns/${id}`)

export const runCampaign       = (id)          => api.post(`/campaigns/${id}/run`)
export const pauseCampaign     = (id)          => api.post(`/campaigns/${id}/pause`)
export const resumeCampaign    = (id)          => api.post(`/campaigns/${id}/resume`)
export const stopCampaign      = (id)          => api.post(`/campaigns/${id}/stop`)
export const resetCampaign    = (id)          => api.post(`/campaigns/${id}/reset`)

export const getCampaignLogs   = (id, page = 1, limit = 20) =>
  api.get(`/campaigns/${id}/logs?page=${page}&limit=${limit}`)
