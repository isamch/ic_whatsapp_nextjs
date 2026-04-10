import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const listId = searchParams.get('listId')
  const page   = Number(searchParams.get('page')  || 1)
  const limit  = Number(searchParams.get('limit') || 50)
  if (!listId) return error('listId is required')

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where: { contactListId: Number(listId) },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.contact.count({ where: { contactListId: Number(listId) } })
  ])
  return ok({ contacts, total, page, limit })
})

export const POST = withAuth(async (req) => {
  const { name, phone, notes, contactListId } = await req.json()
  if (!name || !phone || !contactListId) return error('name, phone and contactListId are required')
  const contact = await prisma.contact.create({
    data: { name, phone, notes, contactListId: Number(contactListId) }
  })
  return created(contact)
})
