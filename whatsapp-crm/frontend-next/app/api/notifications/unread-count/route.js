import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const [res] = await db.select({ count: count() })
    .from(notifications)
    .where(and(
      eq(notifications.userId, req.user.id), 
      eq(notifications.isRead, false)
    ))
  
  return ok({ count: res.count })
})
