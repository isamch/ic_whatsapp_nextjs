import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const updated = await prisma.notification.updateMany({
    where: { id: Number(id), userId: req.user.id },
    data: { isRead: true }
  })
  if (!updated.count) return error('Not found', 404)
  return ok({ message: 'Marked as read' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  const deleted = await prisma.notification.deleteMany({
    where: { id: Number(id), userId: req.user.id }
  })
  if (!deleted.count) return error('Not found', 404)
  return ok({ message: 'Deleted' })
})
