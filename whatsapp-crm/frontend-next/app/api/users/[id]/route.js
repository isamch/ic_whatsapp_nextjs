import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const GET = withAuth(async (req, { params }) => {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
  })
  if (!user) return error('Not found', 404)
  return ok(user)
}, { adminOnly: true })

export const PATCH = withAuth(async (req, { params }) => {
  const { id } = await params
  const { name, email, role } = await req.json()
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { ...(name && { name }), ...(email && { email }), ...(role && { role }) },
    select: { id: true, name: true, email: true, role: true }
  })
  return ok(user)
}, { adminOnly: true })

export const DELETE = withAuth(async (req, { params }) => {
  const { id } = await params
  await prisma.user.delete({ where: { id: Number(id) } })
  return ok({ message: 'Deleted' })
}, { adminOnly: true })
