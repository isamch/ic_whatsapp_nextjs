import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const GET = withAuth(async (req, { params }) => {
  const { id } = await params
  const campaign = await prisma.campaign.findFirst({
    where: { id: Number(id), userId: req.user.id },
    include: { template: true, contactList: true }
  })
  if (!campaign) return error('Not found', 404)
  return ok(campaign)
})

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const data = await req.json()
  const updated = await prisma.campaign.updateMany({
    where: { id: Number(id), userId: req.user.id },
    data
  })
  if (!updated.count) return error('Not found', 404)
  return ok({ message: 'Updated' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  const deleted = await prisma.campaign.deleteMany({
    where: { id: Number(id), userId: req.user.id }
  })
  if (!deleted.count) return error('Not found', 404)
  return ok({ message: 'Deleted' })
})
