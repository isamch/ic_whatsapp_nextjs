import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq, not } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  
  const [user] = await db.select().from(users).where(eq(users.id, Number(id)))
  if (!user) return error('Not found', 404)

  const [updated] = await db.update(users)
    .set({ isActive: !user.isActive })
    .where(eq(users.id, Number(id)))
    .returning({ id: users.id, isActive: users.isActive })
    
  return ok(updated)
}, { adminOnly: true })
