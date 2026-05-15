import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq, desc, count } from 'drizzle-orm'
import { withAuth } from '@/lib/withAuth'
import { ok, created, error } from '@/lib/response'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const page  = Number(searchParams.get('page')  || 1)
  const limit = Number(searchParams.get('limit') || 100)

  const [usersList, totalRes] = await Promise.all([
    db.select({ 
      id: users.id, 
      name: users.name, 
      email: users.email, 
      role: users.role, 
      isActive: users.isActive, 
      createdAt: users.createdAt 
    })
    .from(users)
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(desc(users.createdAt)),
    db.select({ count: count() }).from(users)
  ])
  
  return ok({ users: usersList, total: totalRes[0].count })
}, { adminOnly: true })

export const POST = withAuth(async (req) => {
  const { name, email, password, role } = await req.json()
  if (!name || !email || !password) return error('All fields are required')

  const exists = await db.query.users.findFirst({
    where: eq(users.email, email)
  })
  if (exists) return error('Email already in use')

  const hashed = await bcrypt.hash(password, 10)
  const [user] = await db.insert(users).values({
    name,
    email,
    password: hashed,
    role: role || 'user'
  }).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role
  })
  
  return created(user)
}, { adminOnly: true })
