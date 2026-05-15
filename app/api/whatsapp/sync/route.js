import { getClient } from '@/lib/whatsapp-manager'
import { db } from '@/lib/db'
import { whatsappContacts } from '@/lib/db/schema'
import { eq, and, sql, or, like } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const POST = withAuth(async (req) => {
  const client = getClient(req.user.id)
  if (!client) return error('WhatsApp not connected', 400)

  try {
    const rawContacts = await client.getContacts()
    
    // Filter only individual user contacts with valid numbers
    const validContacts = rawContacts.filter(c => 
      c.isMyContact && 
      c.isUser && 
      !c.isGroup && 
      c.number && 
      c.number.length <= 13 && 
      !c.number.startsWith('10')
    )

    if (validContacts.length === 0) {
      return ok({ message: 'No valid contacts found to sync', count: 0 })
    }

    // 1. Unique by number within this sync request
    const uniqueMap = new Map()
    validContacts.forEach(c => {
      if (!uniqueMap.has(c.number)) {
        uniqueMap.set(c.number, c)
      }
    })
    const uniqueToSync = Array.from(uniqueMap.values())

    // 2. Get existing phones in WhatsAppContact table for THIS user to avoid duplicates
    const existing = await db.query.whatsappContacts.findMany({
      where: eq(whatsappContacts.userId, req.user.id),
      columns: { phone: true }
    })
    const existingPhones = new Set(existing.map(e => e.phone))

    // 3. Insert new contacts into WhatsAppContact table
    const toInsert = uniqueToSync
      .filter(c => !existingPhones.has(c.number))
      .map(c => ({
        name: c.name || c.pushname || c.number,
        phone: c.number,
        userId: req.user.id
      }))

    if (toInsert.length > 0) {
      await db.insert(whatsappContacts).values(toInsert)
    }

    // 4. Cleanup any technical IDs that might have slipped through in previous syncs (if any exist in this table)
    await db.delete(whatsappContacts).where(
      and(
        eq(whatsappContacts.userId, req.user.id),
        or(
          sql`length(${whatsappContacts.phone}) > 13`,
          like(whatsappContacts.phone, '10%')
        )
      )
    )

    return ok({ 
      message: `Successfully synced ${toInsert.length} new contacts to your private WhatsApp table`, 
      total: uniqueToSync.length,
      new: toInsert.length
    })
  } catch (err) {
    console.error('[WhatsApp Sync Error]:', err)
    return error('Failed to sync contacts from WhatsApp', 500)
  }
})
