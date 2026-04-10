import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'
import prisma from '@/lib/prisma'

export const GET = withAuth(async (req) => {
  const session = await prisma.whatsappSession.findUnique({ where: { userId: req.user.id } })
  return ok({ status: session?.status || 'disconnected' })
})
