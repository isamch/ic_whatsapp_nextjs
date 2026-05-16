import { db } from '@/lib/db'
import { contacts, contactLists } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const data = await req.json()

  // Verify ownership
  const userLists = await db.select({ id: contactLists.id })
    .from(contactLists)
    .where(eq(contactLists.userId, req.user.id))
  
  const listIds = userLists.map(l => l.id)
  if (listIds.length === 0) return error('Unauthorized', 403)

  const [contact] = await db.update(contacts)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(contacts.id, Number(id)), inArray(contacts.contactListId, listIds)))
    .returning()

  if (!contact) return error('Contact not found or unauthorized', 404)
  return ok(contact)
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params

  // Verify ownership
  const userLists = await db.select({ id: contactLists.id })
    .from(contactLists)
    .where(eq(contactLists.userId, req.user.id))
  
  const listIds = userLists.map(l => l.id)
  if (listIds.length === 0) return error('Unauthorized', 403)

  const res = await db.delete(contacts)
    .where(and(eq(contacts.id, Number(id)), inArray(contacts.contactListId, listIds)))
  
  return ok({ message: 'Deleted' })
})
