import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const data = await req.json()
  const [contact] = await db.update(contacts)
    .set(data)
    .where(eq(contacts.id, Number(id)))
    .returning()
  return ok(contact)
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await db.delete(contacts).where(eq(contacts.id, Number(id)))
  return ok({ message: 'Deleted' })
})
