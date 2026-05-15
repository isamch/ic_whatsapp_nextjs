import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, desc, count as drizzleCount } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page')  || 1)
  const limit = Number(searchParams.get('limit') || 20)

  const [list, totalRes] = await Promise.all([
    db.select().from(notifications)
      .where(eq(notifications.userId, req.user.id))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(notifications.createdAt)),
    db.select({ count: drizzleCount() }).from(notifications).where(eq(notifications.userId, req.user.id))
  ])
  
  return ok({ notifications: list, total: totalRes[0].count })
})
