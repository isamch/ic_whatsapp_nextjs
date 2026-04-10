import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { getClient } from '@/lib/whatsapp-manager'
import { runCampaignJob } from '@/lib/campaign-runner'

export const POST = withAuth(async (req, { params }) => {
  const { id } = await params
  const campaign = await prisma.campaign.findFirst({
    where: { id: Number(id), userId: req.user.id },
    include: { template: true, contactList: { include: { contacts: true } } }
  })
  if (!campaign) return error('Not found', 404)
  if (campaign.status === 'running') return error('Already running')

  const client = getClient(req.user.id)
  if (!client) return error('WhatsApp not connected', 400)

  await prisma.campaign.update({ where: { id: Number(id) }, data: { status: 'running' } })

  runCampaignJob(campaign, client)

  return ok({ message: 'Campaign started' })
})
