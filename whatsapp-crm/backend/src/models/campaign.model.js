import mongoose from 'mongoose'

const campaignSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true, trim: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  listId:     { type: mongoose.Schema.Types.ObjectId, ref: 'ContactList', required: true },
  status:     { type: String, enum: ['draft', 'running', 'paused', 'completed', 'stopped'], default: 'draft' },
  ratePerMinute: { type: Number, default: 10, min: 1, max: 60 },
  sent:       { type: Number, default: 0 },
  failed:     { type: Number, default: 0 },
  total:      { type: Number, default: 0 },
  startedAt:  { type: Date },
  completedAt:{ type: Date },
}, { timestamps: true, versionKey: false })

const Campaign = mongoose.model('Campaign', campaignSchema)
export default Campaign
