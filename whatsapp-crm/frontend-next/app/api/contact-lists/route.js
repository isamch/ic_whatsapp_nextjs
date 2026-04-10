import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId')
  const lists = await prisma.contactList.findMany({
    where: { userId: req.user.id, ...(categoryId && { categoryId: Number(categoryId) }) },
    include: { category: true, _count: { select: { contacts: true } } }
  })
  return ok(lists)
})

export const POST = withAuth(async (req) => {
  const { name, categoryId } = await req.json()
  if (!name || !categoryId) return error('Name and categoryId are required')
  const list = await prisma.contactList.create({
    data: { name, categoryId: Number(categoryId), userId: req.user.id }
  })
  return created(list)
})
