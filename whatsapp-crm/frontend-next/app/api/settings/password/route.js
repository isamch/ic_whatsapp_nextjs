import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const PATCH = withAuth(async (req) => {
  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) return error('All fields are required')

  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return error('Current password is incorrect', 401)

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } })
  return ok({ message: 'Password updated' })
})
