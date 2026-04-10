import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req) => {
  const { name, email } = await req.json()
  if (!name && !email) return error('Nothing to update')
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { ...(name && { name }), ...(email && { email }) },
    select: { id: true, name: true, email: true, role: true }
  })
  return ok(user)
})
