import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../src/models/user.model.js'
import { hashPassword } from '../src/utils/hashing.js'

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  const existing = await User.findOne({ email: 'isamchajia@gmail.com' })
  if (existing) {
    console.log('⚠️  Admin already exists')
    await mongoose.disconnect()
    return
  }

  const password = await hashPassword('@#isamchajia2003')

  await User.create({
    name: 'isam chajia',
    email: 'isamchajia@gmail.com',
    password,
    roles: ['admin'],
    isActive: true,
  })

  console.log('✅ Admin created successfully')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
