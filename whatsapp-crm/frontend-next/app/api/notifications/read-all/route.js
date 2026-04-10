import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const PATCH = withAuth(async (req) => {
  await prisma.notification.updateMany({ where: { userId: req.user.id }, data: { isRead: true } })
  return ok({ message: 'All marked as read' })
})
