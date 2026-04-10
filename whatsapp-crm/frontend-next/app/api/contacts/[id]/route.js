import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const data = await req.json()
  const contact = await prisma.contact.update({
    where: { id: Number(id) },
    data
  })
  return ok(contact)
})

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await prisma.contact.delete({ where: { id: Number(id) } })
  return ok({ message: 'Deleted' })
})
