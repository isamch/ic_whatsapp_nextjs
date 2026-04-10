import Campaign from '#models/campaign.model.js'
import CampaignLog from '#models/campaign-log.model.js'
import { paginate } from '#utils/pagination.js'

export const createCampaign = async (userId, data) => {
  return Campaign.create({ userId, ...data })
}

export const getCampaigns = async (userId, { status, page, limit }) => {
  const filter = { userId }
  if (status) filter.status = status
  const { skip, meta } = paginate({ page, limit })
  const [data, total] = await Promise.all([
    Campaign.find(filter).sort({ createdAt: -1 }).skip(skip).limit(meta.limit).populate('templateId', 'name').populate('listId', 'name'),
    Campaign.countDocuments(filter),
  ])
  return { data, meta: { ...meta, total, pages: Math.ceil(total / meta.limit) } }
}

export const getCampaignById = async (userId, id) => {
  return Campaign.findOne({ _id: id, userId }).populate('templateId', 'name body').populate('listId', 'name contactCount')
}

export const updateCampaign = async (userId, id, data) => {
  return Campaign.findOneAndUpdate({ _id: id, userId, status: 'draft' }, data, { new: true })
}

export const deleteCampaign = async (userId, id) => {
  const campaign = await Campaign.findOneAndDelete({ _id: id, userId, status: { $in: ['draft', 'completed', 'stopped'] } })
  if (campaign) await CampaignLog.deleteMany({ campaignId: id })
  return campaign
}

export const resetCampaign = async (userId, id) => {
  const campaign = await Campaign.findOne({ _id: id, userId, status: { $in: ['completed', 'stopped'] } })
  if (!campaign) return null
  await CampaignLog.deleteMany({ campaignId: id })
  return Campaign.findByIdAndUpdate(id, { status: 'draft', sent: 0, failed: 0, total: 0, startedAt: null, completedAt: null }, { new: true }).populate('templateId', 'name body').populate('listId', 'name contactCount')
}

export const getCampaignLogs = async (campaignId, userId, { page, limit }) => {
  const campaign = await Campaign.findOne({ _id: campaignId, userId })
  if (!campaign) return null
  const { skip, meta } = paginate({ page, limit })
  const [data, total] = await Promise.all([
    CampaignLog.find({ campaignId }).sort({ sentAt: -1 }).skip(skip).limit(meta.limit).populate('contactId', 'name phone'),
    CampaignLog.countDocuments({ campaignId }),
  ])
  return { data, meta: { ...meta, total, pages: Math.ceil(total / meta.limit) } }
}
