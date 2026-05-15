import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'
import { createClient } from '@/lib/whatsapp-manager'
import { db } from '@/lib/db'
import { whatsappSessions } from '@/lib/db/schema'

export const POST = withAuth(async (req) => {
  createClient(req.user.id)
  
  await db.insert(whatsappSessions)
    .values({ userId: req.user.id, status: 'qr_pending' })
    .onConflictDoUpdate({
      target: whatsappSessions.userId,
      set: { status: 'qr_pending' }
    })

  return ok({ message: 'Connecting...' })
})
