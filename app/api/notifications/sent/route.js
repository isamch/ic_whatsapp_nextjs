import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { desc, sql } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  if (req.user.role !== 'admin') return error('Forbidden', 403)

  // Group by message content and type to avoid showing duplicate broadcast entries to admin
  // This is a simplified grouping for SQLite
  const results = await db.select({
    id: sql`MIN(${notifications.id})`.as('id'),
    subject: notifications.subject,
    message: notifications.message,
    type: notifications.type,
    createdAt: sql`MAX(${notifications.createdAt})`.as('createdAt')
  })
  .from(notifications)
  .groupBy(notifications.subject, notifications.message, notifications.type)
  .orderBy(desc(sql`MAX(${notifications.createdAt})`))
  .limit(50)

  return ok({ data: results })
}, { adminOnly: true })
