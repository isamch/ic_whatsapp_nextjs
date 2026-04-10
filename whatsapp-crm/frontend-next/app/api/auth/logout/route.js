import prisma from '@/lib/prisma'
import { ok, error } from '@/lib/response'

export async function POST(req) {
  try {
    const { refreshToken } = await req.json()

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }

    return ok({ message: 'Logged out' })
  } catch {
    return error('Server error', 500)
  }
}
