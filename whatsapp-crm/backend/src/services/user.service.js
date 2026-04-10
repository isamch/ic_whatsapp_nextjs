import User              from '#models/user.model.js'
import { hashPassword, comparePassword }  from '#utils/hashing.js'
import { paginate }      from '#utils/pagination.js'
import { unauthorized } from '#utils/app-error.js'

export const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const { skip, meta } = paginate({ page, limit })
  const [data, total]  = await Promise.all([
    User.find().skip(skip).limit(meta.limit).lean(),
    User.countDocuments(),
  ])
  return { data, meta: { ...meta, total } }
}

export const findById = async (id) => User.findById(id).lean()

export const create = async (body) => {
  const hashed = await hashPassword(body.password)
  return User.create({ ...body, password: hashed })
}

export const updateById = async (id, body) => {
  if (body.password) body.password = await hashPassword(body.password)
  return User.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()
}

export const deleteById = async (id) => User.findByIdAndDelete(id)

export const changePassword = async (id, currentPassword, newPassword) => {
  const user = await User.findById(id).select('+password')
  if (!user) throw unauthorized('User not found')
  const isMatch = await comparePassword(currentPassword, user.password)
  if (!isMatch) throw unauthorized('Current password is incorrect')
  user.password = await hashPassword(newPassword)
  await user.save()
}

export const toggleStatus = async (id) => {
  const user = await User.findById(id)
  if (!user) return null
  user.isActive = !user.isActive
  await user.save()
  return user
}

export const getPlatformStats = async () => {
  const [totalUsers, activeUsers, totalCampaigns, totalMessages] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    (await import('#models/campaign.model.js')).default.countDocuments(),
    User.aggregate([{ $group: { _id: null, total: { $sum: '$messageCount' } } }]),
  ])
  return {
    totalUsers,
    activeUsers,
    totalCampaigns,
    totalMessages: totalMessages[0]?.total || 0,
  }
}

export const getUsersStats = async () => {
  const Campaign = (await import('#models/campaign.model.js')).default
  const users = await User.find().lean()
  const stats = await Promise.all(users.map(async (u) => {
    const campaigns = await Campaign.countDocuments({ userId: u._id })
    return { ...u, campaignCount: campaigns }
  }))
  return stats
}
