import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  await db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, Number(id)), eq(notifications.userId, req.user.id)))
    
  return ok({ message: 'Marked as read' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await db.delete(notifications)
    .where(and(eq(notifications.id, Number(id)), eq(notifications.userId, req.user.id)))
  
  return ok({ message: 'Deleted' })
})
