import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const POST = withAuth(async (req, { params }) => {
  const { id } = await params
  const res = await db.update(campaigns)
    .set({ status: 'stopped' })
    .where(and(
      eq(campaigns.id, Number(id)), 
      eq(campaigns.userId, req.user.id),
      inArray(campaigns.status, ['running', 'paused'])
    ))
  
  return ok({ message: 'Stopped' })
})
