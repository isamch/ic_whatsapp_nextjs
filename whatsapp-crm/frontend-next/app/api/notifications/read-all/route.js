import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const PATCH = withAuth(async (req) => {
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, req.user.id))
  return ok({ message: 'All marked as read' })
})
