import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:   { type: String, required: [true, 'Name is required'], trim: true },
  body:   { type: String, required: [true, 'Body is required'], trim: true },
  variables: [{ type: String }],
}, {
  timestamps: true,
  versionKey: false,
})

const Template = mongoose.model('Template', templateSchema)
export default Template
