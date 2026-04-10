import prisma from '@/lib/prisma'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/jwt'
import { ok, error } from '@/lib/response'

export async function POST(req) {
  try {
    const { refreshToken } = await req.json()
    if (!refreshToken) return error('Refresh token required', 401)

    const payload = verifyRefreshToken(refreshToken)

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored || stored.expiresAt < new Date()) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
      return error('Invalid refresh token', 401)
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } })
    if (!user || !user.isActive) return error('Unauthorized', 401)

    await prisma.refreshToken.delete({ where: { token: refreshToken } })

    const newAccessToken  = signAccessToken({ id: user.id, role: user.role })
    const newRefreshToken = signRefreshToken({ id: user.id })

    await prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    })

    return ok({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch {
    return error('Invalid refresh token', 401)
  }
}
