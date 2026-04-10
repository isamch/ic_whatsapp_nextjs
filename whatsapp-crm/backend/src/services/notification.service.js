import Notification from '#models/notification.model.js'
import { paginate } from '#utils/pagination.js'

export const send = async (senderId, { recipientId, subject, body }) => {
  const isBroadcast = !recipientId
  return Notification.create({ senderId, recipientId: recipientId || null, subject, body, isBroadcast })
}

export const getInbox = async (userId, { page, limit }) => {
  const { skip, meta } = paginate({ page, limit })
  const filter = { $or: [{ recipientId: userId }, { isBroadcast: true }] }
  const [data, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(meta.limit).populate('senderId', 'name'),
    Notification.countDocuments(filter),
  ])
  return { data, meta: { ...meta, total, pages: Math.ceil(total / meta.limit) } }
}

export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({
    $or: [{ recipientId: userId }, { isBroadcast: true }],
    isRead: false,
  })
}

export const markAsRead = async (userId, id) => {
  return Notification.findOneAndUpdate(
    { _id: id, $or: [{ recipientId: userId }, { isBroadcast: true }] },
    { isRead: true },
    { new: true }
  )
}

export const markAllAsRead = async (userId) => {
  return Notification.updateMany(
    { $or: [{ recipientId: userId }, { isBroadcast: true }], isRead: false },
    { isRead: true }
  )
}

export const deleteFromInbox = async (userId, id) => {
  return Notification.findOneAndDelete({ _id: id, $or: [{ recipientId: userId }, { isBroadcast: true }] })
}

export const getSent = async (senderId, { page, limit }) => {
  const { skip, meta } = paginate({ page, limit })
  const [data, total] = await Promise.all([
    Notification.find({ senderId }).sort({ createdAt: -1 }).skip(skip).limit(meta.limit).populate('recipientId', 'name email'),
    Notification.countDocuments({ senderId }),
  ])
  return { data, meta: { ...meta, total, pages: Math.ceil(total / meta.limit) } }
}
