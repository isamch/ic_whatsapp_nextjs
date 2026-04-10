import mongoose from 'mongoose'

const contactListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: [true, 'Name is required'], trim: true },
  contactCount: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false })

const ContactList = mongoose.model('ContactList', contactListSchema)
export default ContactList
