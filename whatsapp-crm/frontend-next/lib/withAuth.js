import { verifyAccessToken } from './jwt'
import { error } from './response'

export function withAuth(handler, { adminOnly = false } = {}) {
  return async (req, ctx) => {
    try {
      const authHeader = req.headers.get('authorization') || ''
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

      if (!token) return error('Unauthorized', 401)

      const payload = verifyAccessToken(token)

      if (adminOnly && payload.role !== 'admin') return error('Forbidden', 403)

      req.user = payload
      return handler(req, ctx)
    } catch {
      return error('Unauthorized', 401)
    }
  }
}
