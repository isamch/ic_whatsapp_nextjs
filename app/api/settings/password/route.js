import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req) => {
  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) return error('All fields are required')

  const [user] = await db.select().from(users).where(eq(users.id, req.user.id))
  if (!user) return error('User not found', 404)

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return error('Current password is incorrect', 401)

  const hashed = await bcrypt.hash(newPassword, 10)
  await db.update(users).set({ password: hashed }).where(eq(users.id, req.user.id))
  
  return ok({ message: 'Password updated' })
})
