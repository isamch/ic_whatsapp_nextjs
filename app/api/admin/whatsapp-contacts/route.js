import { db } from '@/lib/db'
import { whatsappContacts, users } from '@/lib/db/schema'
import { eq, count as drizzleCount, ne, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const GET = withAuth(async (req) => {
  // Fetch users (non-admins) and count their WhatsApp contacts
  const results = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    contactCount: drizzleCount(whatsappContacts.id)
  })
  .from(users)
  .leftJoin(whatsappContacts, eq(users.id, whatsappContacts.userId))
  .where(ne(users.role, 'admin'))
  .groupBy(users.id, users.name, users.email)
  .orderBy(users.name)

  return ok({ users: results })
}, { adminOnly: true })
