import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import { ok, error } from '@/lib/response'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) return error('All fields are required')

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return error('Invalid credentials', 401)
    if (!user.isActive) return error('Account disabled', 403)

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return error('Invalid credentials', 401)

    const accessToken  = signAccessToken({ id: user.id, role: user.role })
    const refreshToken = signRefreshToken({ id: user.id })

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    })

    const { password: _, ...safeUser } = user
    return ok({ user: safeUser, accessToken, refreshToken })
  } catch {
    return error('Server error', 500)
  }
}
