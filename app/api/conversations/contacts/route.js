import { db } from '@/lib/db'
import { contacts, contactLists } from '@/lib/db/schema'
import { eq, and, or, like } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 30
  const offset = (page - 1) * limit

  const whereClause = and(
    eq(contactLists.userId, req.user.id),
    search ? or(
      like(contacts.name, `%${search}%`),
      like(contacts.phone, `%${search}%`)
    ) : undefined
  )

  const results = await db.select({
    id: contacts.phone,
    dbId: contacts.id,
    name: contacts.name,
    phone: contacts.phone,
    notes: contacts.notes,
  })
  .from(contacts)
  .innerJoin(contactLists, eq(contacts.contactListId, contactLists.id))
  .where(whereClause)
  .limit(limit)
  .offset(offset)

  // Formatting for the conversations UI
  const formatted = results.map(c => ({
    id: c.phone.includes('@') ? c.phone : `${c.phone}@c.us`,
    name: c.name || c.phone,
    phone: c.phone,
    isGroup: false,
    unreadCount: 0,
    lastMessage: c.notes || '',
    lastMessageTime: null
  }))

  return ok({ contacts: formatted, page, limit })
})
