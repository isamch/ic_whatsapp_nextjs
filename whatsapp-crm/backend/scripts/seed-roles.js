import 'dotenv/config'
import mongoose from 'mongoose'
import Role from '../src/models/role.model.js'
import { USER_PERMISSIONS } from '../src/permissions/user.permission.js'
import { ROLE_PERMISSIONS } from '../src/permissions/role.permission.js'
import { WHATSAPP_PERMISSIONS } from '../src/permissions/whatsapp.permission.js'
import { CONTACT_PERMISSIONS } from '../src/permissions/contact.permission.js'
import { CATEGORY_PERMISSIONS, CONTACT_LIST_PERMISSIONS } from '../src/permissions/category.permission.js'
import { TEMPLATE_PERMISSIONS } from '../src/permissions/template.permission.js'
import { CAMPAIGN_PERMISSIONS } from '../src/permissions/campaign.permission.js'
import { CONVERSATION_PERMISSIONS } from '../src/permissions/conversation.permission.js'
import { NOTIFICATION_PERMISSIONS } from '../src/permissions/notification.permission.js'

const userPermissions = [
  ...Object.values(WHATSAPP_PERMISSIONS),
  ...Object.values(CONTACT_PERMISSIONS),
  ...Object.values(CATEGORY_PERMISSIONS),
  ...Object.values(CONTACT_LIST_PERMISSIONS),
  ...Object.values(TEMPLATE_PERMISSIONS),
  ...Object.values(CAMPAIGN_PERMISSIONS),
  ...Object.values(CONVERSATION_PERMISSIONS),
  NOTIFICATION_PERMISSIONS.READ,
  NOTIFICATION_PERMISSIONS.DELETE,
]

const adminPermissions = [
  ...userPermissions,
  ...Object.values(USER_PERMISSIONS),
  ...Object.values(ROLE_PERMISSIONS),
  NOTIFICATION_PERMISSIONS.SEND,
]

const roles = [
  { name: 'admin', permissions: adminPermissions },
  { name: 'user', permissions: userPermissions },
]

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  for (const role of roles) {
    await Role.findOneAndUpdate(
      { name: role.name },
      { $set: { permissions: role.permissions } },
      { upsert: true, new: true }
    )
    console.log(`✅ Seeded role: ${role.name} (${role.permissions.length} permissions)`)
  }

  await mongoose.disconnect()
  console.log('✅ Done — disconnected')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
