import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { getClient } from '@/lib/whatsapp-manager'
import { runCampaignJob } from '@/lib/campaign-runner'

export const POST = withAuth(async (req, { params }) => {
  const { id } = await params
  const campaign = await db.query.campaigns.findFirst({
    where: and(eq(campaigns.id, Number(id)), eq(campaigns.userId, req.user.id), eq(campaigns.status, 'paused')),
    with: {
      template: true,
      contactList: {
        with: {
          contacts: true
        }
      }
    }
  })
  if (!campaign) return error('Campaign not paused', 400)

  const client = getClient(req.user.id)
  if (!client) return error('WhatsApp not connected', 400)

  await db.update(campaigns)
    .set({ status: 'running' })
    .where(eq(campaigns.id, Number(id)))
    
  runCampaignJob(campaign, client)

  return ok({ message: 'Resumed' })
})
