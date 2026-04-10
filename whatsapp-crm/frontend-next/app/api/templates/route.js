import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page')  || 1)
  const limit = Number(searchParams.get('limit') || 100)

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where: { userId: req.user.id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.template.count({ where: { userId: req.user.id } })
  ])
  return ok({ templates, total })
})

export const POST = withAuth(async (req) => {
  const { name, body } = await req.json()
  if (!name || !body) return error('name and body are required')
  const template = await prisma.template.create({
    data: { name, body, userId: req.user.id }
  })
  return created(template)
})
