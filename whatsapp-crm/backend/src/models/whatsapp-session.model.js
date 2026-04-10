import mongoose from 'mongoose'

const whatsappSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  status: { type: String, enum: ['connected', 'disconnected', 'qr_pending'], default: 'disconnected' },
  connectedAt: { type: Date, default: null },
  disconnectedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

const WhatsappSession = mongoose.model('WhatsappSession', whatsappSessionSchema)
export default WhatsappSession
