import { db } from '@/lib/db'
import { refreshTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { ok, error } from '@/lib/response'

export async function POST(req) {
  try {
    const { refreshToken } = await req.json()

    if (refreshToken) {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken))
    }

    return ok({ message: 'Logged out' })
  } catch {
    return error('Server error', 500)
  }
}
