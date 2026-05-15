import { db } from '@/lib/db'
import { templates } from '@/lib/db/schema'
import { eq, desc, count } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page')  || 1)
  const limit = Number(searchParams.get('limit') || 100)

  const [list, totalRes] = await Promise.all([
    db.select().from(templates)
      .where(eq(templates.userId, req.user.id))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(templates.createdAt)),
    db.select({ count: count() }).from(templates).where(eq(templates.userId, req.user.id))
  ])
  
  return ok({ templates: list, total: totalRes[0].count })
})

export const POST = withAuth(async (req) => {
  const { name, body } = await req.json()
  if (!name || !body) return error('name and body are required')
  const [template] = await db.insert(templates).values({ 
    name, 
    body, 
    userId: req.user.id 
  }).returning()
  return created({ template })
})
