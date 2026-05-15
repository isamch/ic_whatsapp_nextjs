import { db } from '@/lib/db'
import { contactLists, categories, contacts } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId')

  const whereClause = categoryId
    ? and(eq(contactLists.userId, req.user.id), eq(contactLists.categoryId, Number(categoryId)))
    : eq(contactLists.userId, req.user.id)

  const results = await db.select({
    id: contactLists.id,
    name: contactLists.name,
    categoryId: contactLists.categoryId,
    userId: contactLists.userId,
    createdAt: contactLists.createdAt,
    category: categories,
    contactCount: count(contacts.id)
  })
  .from(contactLists)
  .leftJoin(categories, eq(contactLists.categoryId, categories.id))
  .leftJoin(contacts, eq(contactLists.id, contacts.contactListId))
  .where(whereClause)
  .groupBy(contactLists.id, categories.id)

  return ok({ lists: results })
})

export const POST = withAuth(async (req) => {
  const { name, categoryId } = await req.json()
  if (!name || !categoryId) return error('Name and categoryId are required')
  const [list] = await db.insert(contactLists).values({ 
    name, 
    categoryId: Number(categoryId), 
    userId: req.user.id 
  }).returning()
  return created({ list })
})
