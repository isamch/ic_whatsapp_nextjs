import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id: Number(id) } })
  if (!user) return error('Not found', 404)
  const updated = await prisma.user.update({
    where: { id: Number(id) },
    data: { isActive: !user.isActive },
    select: { id: true, isActive: true }
  })
  return ok(updated)
}, { adminOnly: true })
