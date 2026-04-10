import mongoose from 'mongoose'
import Role from './role.model.js'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name max 50 chars'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  roles: [{
    type: String,
    ref: 'Role',
  }],
  extraPermissions: { type: [String], default: [] },
  revokedPermissions: { type: [String], default: [] },
  refreshToken: { type: String, select: false },
  isActive: { type: Boolean, default: true },
  messageCount: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: null },
}, {
  timestamps: true,
  versionKey: false,
})

userSchema.pre('save', async function (next) {
  if (!this.isNew || this.roles.length > 0) return next()
  const defaultRole = await Role.findOne({ name: 'user' })
  if (defaultRole) this.roles = ['user']
  next()
})

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.refreshToken
  return obj
}

const User = mongoose.model('User', userSchema)
export default User
