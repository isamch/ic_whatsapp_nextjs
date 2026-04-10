import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const POST = withAuth(async (req, { params }) => {
  const { id } = await params
  const updated = await prisma.campaign.updateMany({
    where: { id: Number(id), userId: req.user.id, status: 'running' },
    data: { status: 'paused' }
  })
  if (!updated.count) return error('Campaign not running', 400)
  return ok({ message: 'Paused' })
})
