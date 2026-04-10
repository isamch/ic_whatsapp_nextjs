import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const page   = Number(searchParams.get('page')   || 1)
  const limit  = Number(searchParams.get('limit')  || 20)
  const status = searchParams.get('status')

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where: { userId: req.user.id, ...(status && { status }) },
      include: { template: { select: { name: true } }, contactList: { select: { name: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.campaign.count({ where: { userId: req.user.id } })
  ])
  return ok({ campaigns, total })
})

export const POST = withAuth(async (req) => {
  const { name, templateId, contactListId, scheduledAt } = await req.json()
  if (!name || !templateId || !contactListId) return error('name, templateId and contactListId are required')

  const totalCount = await prisma.contact.count({ where: { contactListId: Number(contactListId) } })

  const campaign = await prisma.campaign.create({
    data: {
      name,
      templateId: Number(templateId),
      contactListId: Number(contactListId),
      userId: req.user.id,
      totalCount,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null
    }
  })
  return created(campaign)
})
