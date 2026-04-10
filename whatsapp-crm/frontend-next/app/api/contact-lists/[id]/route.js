import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const { name, categoryId } = await req.json()
  const updated = await prisma.contactList.updateMany({
    where: { id: Number(id), userId: req.user.id },
    data: { ...(name && { name }), ...(categoryId && { categoryId: Number(categoryId) }) }
  })
  if (!updated.count) return error('Not found', 404)
  return ok({ message: 'Updated' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  const deleted = await prisma.contactList.deleteMany({
    where: { id: Number(id), userId: req.user.id }
  })
  if (!deleted.count) return error('Not found', 404)
  return ok({ message: 'Deleted' })
})
