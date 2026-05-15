import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { getQR } from '@/lib/whatsapp-manager'
import QRCode from 'qrcode'

export const GET = withAuth(async (req) => {
  const qr = getQR(req.user.id)
  if (!qr) return ok({ qr: null })
  const qrImage = await QRCode.toDataURL(qr)
  return ok({ qr: qrImage })
})
