import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page')  || 1)
  const limit = Number(searchParams.get('limit') || 100)

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ])
  return ok({ users, total })
}, { adminOnly: true })

export const POST = withAuth(async (req) => {
  const { name, email, password, role } = await req.json()
  if (!name || !email || !password) return error('All fields are required')

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return error('Email already in use')

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role || 'user' },
    select: { id: true, name: true, email: true, role: true }
  })
  return created(user)
}, { adminOnly: true })
