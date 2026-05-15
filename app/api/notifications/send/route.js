import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { db } from '@/lib/db'
import { notifications, users } from '@/lib/db/schema'

// POST /api/notifications/send
export const POST = withAuth(async (req) => {
  const { userId, message } = await req.json()

  if (!message) {
    return error('Message is required', 400)
  }

  try {
    if (userId) {
      // Send to specific user
      const [newNotification] = await db.insert(notifications).values({ 
        userId: parseInt(userId), 
        message 
      }).returning()
      return ok(newNotification)
    } else {
      // Send to ALL users
      const allUsers = await db.select({ id: users.id }).from(users)
      
      if (allUsers.length === 0) return ok({ count: 0 })

      const values = allUsers.map(user => ({ userId: user.id, message }))
      const result = await db.insert(notifications).values(values)
      
      return ok({ count: allUsers.length })
    }
  } catch (err) {
    console.error('Error sending notification:', err)
    return error('Failed to send notification', 500)
  }
}, { adminOnly: true }) // Restricted to admins
