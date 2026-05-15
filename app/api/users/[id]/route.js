import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const GET = withAuth(async (req, { params }) => {
  const { id } = await params
  const [user] = await db.select({ 
    id: users.id, 
    name: users.name, 
    email: users.email, 
    role: users.role, 
    isActive: users.isActive, 
    createdAt: users.createdAt 
  })
  .from(users)
  .where(eq(users.id, Number(id)))
  
  if (!user) return error('Not found', 404)
  return ok(user)
}, { adminOnly: true })

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const { name, email, role } = await req.json()
  const [updatedUser] = await db.update(users)
    .set({ ...(name && { name }), ...(email && { email }), ...(role && { role }) })
    .where(eq(users.id, Number(id)))
    .returning({ id: users.id, name: users.name, email: users.email, role: users.role })
    
  return ok(updatedUser)
}, { adminOnly: true })

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await db.delete(users).where(eq(users.id, Number(id)))
  return ok({ message: 'Deleted' })
}, { adminOnly: true })
