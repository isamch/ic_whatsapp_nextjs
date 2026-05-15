import { db } from '@/lib/db'
import { campaigns, contacts } from '@/lib/db/schema'
import { eq, and, desc, count } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const page   = Number(searchParams.get('page')   || 1)
  const limit  = Number(searchParams.get('limit')  || 20)
  const status = searchParams.get('status')

  const whereClause = status 
    ? and(eq(campaigns.userId, req.user.id), eq(campaigns.status, status))
    : eq(campaigns.userId, req.user.id)

  const [list, totalRes] = await Promise.all([
    db.query.campaigns.findMany({
      where: whereClause,
      with: {
        template: { columns: { name: true } },
        contactList: { columns: { name: true } }
      },
      limit: limit,
      offset: (page - 1) * limit,
      orderBy: [desc(campaigns.createdAt)]
    }),
    db.select({ count: count() }).from(campaigns).where(whereClause)
  ])
  
  return ok({ campaigns: list, total: totalRes[0].count })
})

export const POST = withAuth(async (req) => {
  const { name, templateId, contactListId } = await req.json()
  if (!name || !templateId || !contactListId) return error('name, templateId and contactListId are required')

  const totalRes = await db.select({ count: count() })
    .from(contacts)
    .where(eq(contacts.contactListId, Number(contactListId)))

  const [campaign] = await db.insert(campaigns).values({
    name,
    templateId: Number(templateId),
    contactListId: Number(contactListId),
    userId: req.user.id,
    totalCount: totalRes[0].count
  }).returning()

  return created({ campaign })
})
