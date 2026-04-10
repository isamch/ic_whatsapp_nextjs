import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  senderId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  recipientId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  subject:    { type: String, required: true, trim: true },
  body:       { type: String, required: true, trim: true },
  isRead:     { type: Boolean, default: false },
  isBroadcast:{ type: Boolean, default: false },
  isSystem:   { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
