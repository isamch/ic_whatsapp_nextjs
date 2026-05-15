import { db } from '@/lib/db'
import { templates } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const { name, content } = await req.json()
  
  await db.update(templates)
    .set({ 
      ...(name && { name }), 
      ...(content && { content }),
      updatedAt: new Date()
    })
    .where(and(eq(templates.id, Number(id)), eq(templates.userId, req.user.id)))
  
  return ok({ message: 'Updated' })
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await db.delete(templates)
    .where(and(eq(templates.id, Number(id)), eq(templates.userId, req.user.id)))
    
  return ok({ message: 'Deleted' })
})
