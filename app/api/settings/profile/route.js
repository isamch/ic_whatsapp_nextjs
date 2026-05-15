import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req) => {
  const { name, email } = await req.json()
  if (!name && !email) return error('Nothing to update')
  
  const [user] = await db.update(users)
    .set({ ...(name && { name }), ...(email && { email }) })
    .where(eq(users.id, req.user.id))
    .returning({ id: users.id, name: users.name, email: users.email, role: users.role })
    
  return ok(user)
})
