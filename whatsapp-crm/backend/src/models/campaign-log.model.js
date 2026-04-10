import mongoose from 'mongoose'

const campaignLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  contactId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  phone:      { type: String, required: true },
  status:     { type: String, enum: ['sent', 'failed'], required: true },
  error:      { type: String, default: null },
  sentAt:     { type: Date, default: Date.now },
}, { versionKey: false })

const CampaignLog = mongoose.model('CampaignLog', campaignLogSchema)
export default CampaignLog
