import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const count = await prisma.notification.count({ where: { userId: req.user.id, isRead: false } })
  return ok({ count })
})
