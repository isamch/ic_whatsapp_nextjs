import { db } from '@/lib/db'
import { contactLists } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const { name, categoryId } = await req.json()
  
  await db.update(contactLists)
    .set({ 
      ...(name && { name }), 
      ...(categoryId && { categoryId: Number(categoryId) }) 
    })
    .where(and(eq(contactLists.id, Number(id)), eq(contactLists.userId, req.user.id)))
    
  return ok({ message: 'Updated' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await db.delete(contactLists)
    .where(and(eq(contactLists.id, Number(id)), eq(contactLists.userId, req.user.id)))
  
  return ok({ message: 'Deleted' })
})
