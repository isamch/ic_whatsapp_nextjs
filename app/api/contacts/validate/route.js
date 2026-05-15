import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { getClient } from '@/lib/whatsapp-manager'

export const POST = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const listId = searchParams.get('listId')
  if (!listId) return error('listId is required')

  const list = await db.select().from(contacts).where(eq(contacts.contactListId, Number(listId)))
  const client = getClient(req.user.id)

  if (!client) return error('WhatsApp not connected', 400)

  const results = await Promise.all(
    list.map(async (c) => {
      try {
        const isValid = await client.isRegisteredUser(`${c.phone}@c.us`)
        console.log(`[Validation] Phone ${c.phone}: ${isValid}`)
        await db.update(contacts).set({ isValid }).where(eq(contacts.id, c.id))
        return { id: c.id, isValid }
      } catch (err) {
        console.error(`[Validation] Error for ${c.phone}:`, err.message)
        return { id: c.id, isValid: false }
      }
    })
  )

  return ok(results)
})
