import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const categories = await prisma.category.findMany({ where: { userId: req.user.id } })
  return ok(categories)
})

export const POST = withAuth(async (req) => {
  const { name } = await req.json()
  if (!name) return error('Name is required')
  const category = await prisma.category.create({ data: { name, userId: req.user.id } })
  return created(category)
})
