import { db } from '@/lib/db'
import { refreshTokens, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/jwt'
import { ok, error } from '@/lib/response'

export async function POST(req) {
  try {
    const { refreshToken } = await req.json()
    if (!refreshToken) return error('Refresh token required', 401)

    const payload = verifyRefreshToken(refreshToken)

    const stored = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, refreshToken)
    })
    
    if (!stored || new Date(stored.expiresAt) < new Date()) {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken))
      return error('Invalid refresh token', 401)
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id)
    })
    
    if (!user || !user.isActive) return error('Unauthorized', 401)

    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken))

    const newAccessToken  = signAccessToken({ id: user.id, role: user.role })
    const newRefreshToken = signRefreshToken({ id: user.id })

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    await db.insert(refreshTokens).values({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: expiresAt
    })

    return ok({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch {
    return error('Invalid refresh token', 401)
  }
}
