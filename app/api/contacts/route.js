import { db } from '@/lib/db'
import { contacts, contactLists } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const listId = searchParams.get('listId')
  const page   = Number(searchParams.get('page')  || 1)
  const limit  = Number(searchParams.get('limit') || 50)
  if (!listId) return error('listId is required')

  // Verify ownership
  const [listOwner] = await db.select()
    .from(contactLists)
    .where(and(eq(contactLists.id, Number(listId)), eq(contactLists.userId, req.user.id)))
  
  if (!listOwner) return error('Unauthorized or list not found', 403)

  const [list, totalRes] = await Promise.all([
    db.select().from(contacts)
      .where(eq(contacts.contactListId, Number(listId)))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ count: count() }).from(contacts).where(eq(contacts.contactListId, Number(listId)))
  ])
  
  return ok({ contacts: list, total: totalRes[0].count, page, limit })
})

export const POST = withAuth(async (req) => {
  const { name, phone, notes, contactListId } = await req.json()
  if (!name || !phone || !contactListId) return error('name, phone and contactListId are required')

  // Verify ownership
  const [listOwner] = await db.select()
    .from(contactLists)
    .where(and(eq(contactLists.id, Number(contactListId)), eq(contactLists.userId, req.user.id)))
  
  if (!listOwner) return error('Unauthorized or list not found', 403)

  const [contact] = await db.insert(contacts).values({ 
    name, 
    phone, 
    notes, 
    contactListId: Number(contactListId),
    updatedAt: new Date()
  }).returning()
  return created({ contact })
})
