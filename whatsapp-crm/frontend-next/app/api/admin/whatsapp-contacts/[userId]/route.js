import { db } from '@/lib/db'
import { whatsappContacts, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const GET = withAuth(async (req, { params }) => {
  const { userId: rawUserId } = await params
  const userId = parseInt(rawUserId)
  if (isNaN(userId)) return error('Invalid user ID', 400)

  // Fetch the user info first
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })
  if (!user) return error('User not found', 404)

  // Fetch the user's WhatsApp contacts
  const results = await db.query.whatsappContacts.findMany({
    where: eq(whatsappContacts.userId, userId),
    orderBy: (contacts, { asc }) => [asc(contacts.name)]
  })

  return ok({ 
    user: { id: user.id, name: user.name, email: user.email },
    contacts: results 
  })
}, { adminOnly: true })
