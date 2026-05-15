import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const GET = withAuth(async (req, { params }) => {
  const { id } = await params
  const campaign = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.id, Number(id)), eq(campaigns.userId, req.user.id)),
    with: {
      template: true,
      contactList: true
    }
  })
  if (!campaign) return error('Not found', 404)
  return ok(campaign)
})

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const data = await req.json()
  
  const res = await db.update(campaigns)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(campaigns.id, Number(id)), eq(campaigns.userId, req.user.id)))
  
  return ok({ message: 'Updated' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await db.delete(campaigns)
    .where(and(eq(campaigns.id, Number(id)), eq(campaigns.userId, req.user.id)))
  
  return ok({ message: 'Deleted' })
})
