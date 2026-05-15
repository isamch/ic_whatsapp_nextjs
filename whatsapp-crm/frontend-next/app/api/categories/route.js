import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const list = await db.select().from(categories).where(eq(categories.userId, req.user.id))
  return ok({ categories: list })
})

export const POST = withAuth(async (req) => {
  const { name } = await req.json()
  if (!name) return error('Name is required')
  const [category] = await db.insert(categories).values({ 
    name, 
    userId: req.user.id 
  }).returning()
  return created({ category })
})
