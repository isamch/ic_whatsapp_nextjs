import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const DELETE = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const listId = searchParams.get('listId')
  if (!listId) return error('listId is required')

  const res = await db.delete(contacts)
    .where(and(
      eq(contacts.contactListId, Number(listId)), 
      eq(contacts.isValid, false)
    ))
    
  return ok({ message: 'Invalid contacts cleared' })
})
