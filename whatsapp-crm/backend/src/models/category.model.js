import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: [true, 'Name is required'], trim: true },
}, { timestamps: true, versionKey: false })

const Category = mongoose.model('Category', categorySchema)
export default Category
