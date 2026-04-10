import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const { name } = await req.json()
  const category = await prisma.category.updateMany({
    where: { id: Number(id), userId: req.user.id },
    data: { name }
  })
  if (!category.count) return error('Not found', 404)
  return ok({ message: 'Updated' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  const deleted = await prisma.category.deleteMany({
    where: { id: Number(id), userId: req.user.id }
  })
  if (!deleted.count) return error('Not found', 404)
  return ok({ message: 'Deleted' })
})
