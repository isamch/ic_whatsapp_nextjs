import { db } from '@/lib/db'
import { whatsappContacts } from '@/lib/db/schema'
import { eq, and, or, like } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  
  const results = await db.query.whatsappContacts.findMany({
    where: and(
      eq(whatsappContacts.userId, req.user.id),
      search ? or(
        like(whatsappContacts.name, `%${search}%`),
        like(whatsappContacts.phone, `%${search}%`)
      ) : undefined
    ),
    orderBy: (contacts, { asc }) => [asc(contacts.name)]
  })

  return ok({ contacts: results })
})
