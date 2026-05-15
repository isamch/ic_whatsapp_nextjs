import { db } from '@/lib/db'
import { notifications, users } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

// GET /api/notifications/sent (Admin only to see history)
export const GET = withAuth(async (req) => {
  if (req.user.role !== 'admin') return error('Forbidden', 403)

  const results = await db.select({
    id: notifications.id,
    subject: notifications.subject,
    message: notifications.message,
    type: notifications.type,
    createdAt: notifications.createdAt,
    userId: notifications.userId
  })
  .from(notifications)
  .orderBy(desc(notifications.createdAt))
  .limit(50)

  return ok({ data: results })
}, { adminOnly: true })

// POST /api/notifications (Send notification)
export const POST = withAuth(async (req) => {
  if (req.user.role !== 'admin') return error('Forbidden', 403)

  const { subject, body, recipientId, type } = await req.json()
  if (!subject || !body) return error('Subject and body are required', 400)

  const notificationType = type || (recipientId ? 'private' : 'broadcast')

  if (recipientId && recipientId !== 'all') {
    // Single recipient
    const [notif] = await db.insert(notifications).values({
      userId: parseInt(recipientId),
      subject,
      message: body,
      type: notificationType
    }).returning()
    return ok(notif)
  } else {
    // Broadcast to ALL users
    const allUsers = await db.query.users.findMany({
      columns: { id: true }
    })

    const toInsert = allUsers.map(u => ({
      userId: u.id,
      subject,
      message: body,
      type: notificationType === 'private' ? 'broadcast' : notificationType
    }))

    if (toInsert.length > 0) {
      const results = await db.insert(notifications).values(toInsert).returning()
      return ok(results[0])
    }

    return error('No users found to broadcast', 400)
  }
}, { adminOnly: true })
