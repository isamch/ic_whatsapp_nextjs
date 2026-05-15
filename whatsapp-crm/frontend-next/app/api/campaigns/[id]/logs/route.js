import { db } from '@/lib/db'
import { campaigns, campaignLogs } from '@/lib/db/schema'
import { eq, and, desc, count } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const GET = withAuth(async (req, { params }) => {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page')  || 1)
  const limit = Number(searchParams.get('limit') || 20)

  const campaign = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.id, Number(id)), eq(campaigns.userId, req.user.id))
  })
  if (!campaign) return error('Not found', 404)

  const [list, totalRes] = await Promise.all([
    db.query.campaignLogs.findMany({
      where: eq(campaignLogs.campaignId, Number(id)),
      with: {
        contact: { columns: { name: true, phone: true } }
      },
      limit: limit,
      offset: (page - 1) * limit,
      orderBy: [desc(campaignLogs.sentAt)]
    }),
    db.select({ count: count() }).from(campaignLogs).where(eq(campaignLogs.campaignId, Number(id)))
  ])
  
  return ok({ logs: list, total: totalRes[0].count })
})
