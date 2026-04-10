import asyncHandler from '#utils/async-handler.js'
import { unauthorized, forbidden } from '#utils/app-error.js'
import { verifyAccessToken } from '#utils/jwt.js'
import User from '#models/user.model.js'
import Role from '#models/role.model.js'

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) throw unauthorized('Authentication token missing or malformed')

  const decoded = verifyAccessToken(authHeader.split(' ')[1])
  if (!decoded) throw unauthorized('Invalid or expired token')

  const user = await User.findById(decoded.id).select('-password -refreshToken')
  if (!user) throw unauthorized('User belonging to this token no longer exists')

  // load permissions from all roles
  const rolesDocs = await Role.find({ name: { $in: user.roles } })
  const rolePermissions = rolesDocs.flatMap(r => r.permissions)

  // final permissions = rolePermissions + extraPermissions - revokedPermissions
  user.resolvedPermissions = [
    ...new Set([...rolePermissions, ...user.extraPermissions]),
  ].filter(p => !user.revokedPermissions.includes(p))

  req.user = user
  next()
})

export const checkIsActive = asyncHandler(async (req, res, next) => {
  if (!req.user.isActive) throw forbidden('Your account has been deactivated')
  next()
})
