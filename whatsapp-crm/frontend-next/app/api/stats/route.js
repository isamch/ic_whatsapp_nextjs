import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { db } from '@/lib/db'
import { campaigns, contacts, templates, campaignLogs, contactLists } from '@/lib/db/schema'
import { eq, and, sql, count } from 'drizzle-orm'

export const GET = withAuth(async (req) => {
  try {
    const userId = req.user.id

    // Get basic counts using Drizzle
    const [
      campaignsRes,
      contactsRes,
      templatesRes,
      activeCampaignsRes
    ] = await Promise.all([
      db.select({ count: count() }).from(campaigns).where(eq(campaigns.userId, userId)),
      db.select({ count: count() })
        .from(contacts)
        .innerJoin(contactLists, eq(contacts.contactListId, contactLists.id))
        .where(eq(contactLists.userId, userId)),
      db.select({ count: count() }).from(templates).where(eq(templates.userId, userId)),
      db.select({ count: count() }).from(campaigns).where(
        and(eq(campaigns.userId, userId), eq(campaigns.status, 'running'))
      )
    ])

    // Get success/failed stats from logs
    const statsRes = await db.select({ 
      status: campaignLogs.status, 
      count: count() 
    })
    .from(campaignLogs)
    .innerJoin(campaigns, eq(campaignLogs.campaignId, campaigns.id))
    .where(eq(campaigns.userId, userId))
    .groupBy(campaignLogs.status)

    const sentCount = statsRes.find(s => s.status === 'sent')?.count || 0
    const failedCount = statsRes.find(s => s.status === 'failed')?.count || 0

    return ok({
      campaigns: campaignsRes[0].count,
      contacts: contactsRes[0].count,
      templates: templatesRes[0].count,
      activeCampaigns: activeCampaignsRes[0].count,
      totalSent: sentCount,
      totalFailed: failedCount,
      successRate: sentCount + failedCount > 0 
        ? Math.round((sentCount / (sentCount + failedCount)) * 100) 
        : 0
    })
  } catch (err) {
    console.error('Error fetching stats:', err)
    return error('Failed to fetch dashboard statistics', 500)
  }
})
