import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const GET = withAuth(async (req, { params }) => {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page')  || 1)
  const limit = Number(searchParams.get('limit') || 20)

  const campaign = await prisma.campaign.findFirst({ where: { id: Number(id), userId: req.user.id } })
  if (!campaign) return error('Not found', 404)

  const [logs, total] = await Promise.all([
    prisma.campaignLog.findMany({
      where: { campaignId: Number(id) },
      include: { contact: { select: { name: true, phone: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { sentAt: 'desc' }
    }),
    prisma.campaignLog.count({ where: { campaignId: Number(id) } })
  ])
  return ok({ logs, total })
})
