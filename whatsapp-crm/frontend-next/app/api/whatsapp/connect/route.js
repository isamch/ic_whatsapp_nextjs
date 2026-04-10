import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'
import { createClient } from '@/lib/whatsapp-manager'
import prisma from '@/lib/prisma'

export const POST = withAuth(async (req) => {
  createClient(req.user.id)
  await prisma.whatsappSession.upsert({
    where: { userId: req.user.id },
    update: { status: 'pending' },
    create: { userId: req.user.id, status: 'pending' }
  })
  return ok({ message: 'Connecting...' })
})
