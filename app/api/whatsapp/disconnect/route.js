import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'
import { destroyClient } from '@/lib/whatsapp-manager'

export const POST = withAuth(async (req) => {
  await destroyClient(req.user.id)
  return ok({ message: 'Disconnected' })
})
