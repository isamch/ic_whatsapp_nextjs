import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContactList', required: true },
  name: { type: String, trim: true, default: '' },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    match: [/^\+?[1-9]\d{6,14}$/, 'Invalid phone number format'],
  },
  notes: { type: String, default: '' },
  validationStatus: {
    type: String,
    enum: ['pending', 'valid', 'invalid', 'unknown'],
    default: 'pending',
  },
}, { timestamps: true, versionKey: false })

const Contact = mongoose.model('Contact', contactSchema)
export default Contact
