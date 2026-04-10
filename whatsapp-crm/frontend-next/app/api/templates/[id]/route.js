import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const { name, body } = await req.json()
  const updated = await prisma.template.updateMany({
    where: { id: Number(id), userId: req.user.id },
    data: { ...(name && { name }), ...(body && { body }) }
  })
  if (!updated.count) return error('Not found', 404)
  return ok({ message: 'Updated' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  const deleted = await prisma.template.deleteMany({
    where: { id: Number(id), userId: req.user.id }
  })
  if (!deleted.count) return error('Not found', 404)
  return ok({ message: 'Deleted' })
})
