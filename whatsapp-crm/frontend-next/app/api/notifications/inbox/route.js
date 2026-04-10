import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page')  || 1)
  const limit = Number(searchParams.get('limit') || 20)

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user.id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where: { userId: req.user.id } })
  ])
  return ok({ notifications, total })
})
