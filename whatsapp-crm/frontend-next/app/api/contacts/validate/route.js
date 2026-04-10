import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { getClient } from '@/lib/whatsapp-manager'

export const POST = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const listId = searchParams.get('listId')
  if (!listId) return error('listId is required')

  const contacts = await prisma.contact.findMany({ where: { contactListId: Number(listId) } })
  const client = getClient(req.user.id)

  if (!client) return error('WhatsApp not connected', 400)

  const results = await Promise.all(
    contacts.map(async (c) => {
      try {
        const isValid = await client.isRegisteredUser(`${c.phone}@c.us`)
        await prisma.contact.update({ where: { id: c.id }, data: { isValid } })
        return { id: c.id, isValid }
      } catch {
        return { id: c.id, isValid: false }
      }
    })
  )

  return ok(results)
})
