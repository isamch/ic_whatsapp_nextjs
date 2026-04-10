import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import { created, error } from '@/lib/response'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) return error('All fields are required')

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return error('Email already in use')

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true }
    })

    const accessToken  = signAccessToken({ id: user.id, role: user.role })
    const refreshToken = signRefreshToken({ id: user.id })

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    })

    return created({ user, accessToken, refreshToken })
  } catch {
    return error('Server error', 500)
  }
}
