import { db } from '@/lib/db'
import { campaigns, campaignLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const POST = withAuth(async (req, { params }) => {
  const { id } = await params
  const campaignId = Number(id)

  try {
    // 1. Delete all logs for this campaign
    await db.delete(campaignLogs)
      .where(eq(campaignLogs.campaignId, campaignId))

    // 2. Reset campaign status and counters
    await db.update(campaigns)
      .set({ 
        status: 'draft', 
        sentCount: 0, 
        failedCount: 0,
        updatedAt: new Date()
      })
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, req.user.id)))

    return ok({ message: 'Campaign reset successfully' })
  } catch (err) {
    console.error('[Campaign Reset Error]:', err)
    return error('Failed to reset campaign', 500)
  }
})
