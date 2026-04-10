import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  permissions: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
  versionKey: false,
})

const Role = mongoose.model('Role', roleSchema)
export default Role
