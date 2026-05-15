import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, refreshTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import { created, error } from '@/lib/response'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

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
      role: 'user'
    }).returning()

    const accessToken  = signAccessToken({ id: user.id, role: user.role })
    const refreshToken = signRefreshToken({ id: user.id })

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: user.id,
      expiresAt: expiresAt
    })

    const { password: _, ...safeUser } = user
    return created({ user: safeUser, accessToken, refreshToken })
  } catch {
    return error('Server error', 500)
  }
}
