import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const DELETE = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const listId = searchParams.get('listId')
  if (!listId) return error('listId is required')

  const deleted = await prisma.contact.deleteMany({
    where: { contactListId: Number(listId), isValid: false }
  })
  return ok({ deleted: deleted.count })
})
