import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const POST = withAuth(async (req, { params }) => {
  const { id } = await params
  const res = await db.update(campaigns)
    .set({ status: 'paused' })
    .where(and(
      eq(campaigns.id, Number(id)), 
      eq(campaigns.userId, req.user.id),
      eq(campaigns.status, 'running')
    ))
  
  return ok({ message: 'Paused' })
})
