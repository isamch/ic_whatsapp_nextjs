import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'
import { db } from '@/lib/db'
import { whatsappSessions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getClient, createClient, getQR, getStatus } from '@/lib/whatsapp-manager'

export async function GET(req) {
  return withAuth(async (req) => {
    try {
      const userId = req.user.id
      const [session] = await db.select().from(whatsappSessions).where(eq(whatsappSessions.userId, userId))
      
      let client = getClient(userId)
      
      // Auto-resume if connected in DB but not in memory
      if (!client && session && session.status === 'connected') {
        console.log(`[WhatsApp] Auto-resuming session for user: ${userId}`)
        createClient(userId)
        return ok({ status: 'connecting' })
      }

      if (!session) return ok({ status: 'disconnected' })
      
      // Check actual engine status
      const actualStatus = await getStatus(userId)
      if (actualStatus === 'INITIALIZING') return ok({ status: 'connecting' })
      if (actualStatus === 'CONNECTED') return ok({ status: 'connected' })

      // Check for QR
      const qr = getQR(userId)
      if (qr) return ok({ status: 'qr_pending', qr })
      
      return ok({ status: session.status })
    } catch (err) {
      console.error(`[WhatsApp Status API Error]:`, err)
      return ok({ status: 'error', message: err.message })
    }
  })(req)
}
