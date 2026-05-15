import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const { name } = await req.json()
  
  await db.update(categories)
    .set({ name })
    .where(and(eq(categories.id, Number(id)), eq(categories.userId, req.user.id)))
    
  return ok({ message: 'Updated' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await db.delete(categories)
    .where(and(eq(categories.id, Number(id)), eq(categories.userId, req.user.id)))
    
  return ok({ message: 'Deleted' })
})
