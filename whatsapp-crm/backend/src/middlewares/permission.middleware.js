import { unauthorized, forbidden } from '#utils/app-error.js'

const can = (user, permission) => user.resolvedPermissions?.includes(permission) ?? false

export const hasPermission = (permission) => (req, res, next) => {
  if (!req.user) return next(unauthorized())
  if (!can(req.user, permission))
    return next(forbidden(`Missing permission: '${permission}'`))
  next()
}

export const hasAllPermissions = (...permissions) => (req, res, next) => {
  if (!req.user) return next(unauthorized())
  const missing = permissions.filter(p => !can(req.user, p))
  if (missing.length > 0) return next(forbidden(`Missing permissions: ${missing.join(', ')}`))
  next()
}

export const hasAnyPermission = (...permissions) => (req, res, next) => {
  if (!req.user) return next(unauthorized())
  if (!permissions.some(p => can(req.user, p)))
    return next(forbidden(`Requires one of: ${permissions.join(', ')}`))
  next()
}

export const hasRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(unauthorized())
  if (!req.user.roles?.some(r => roles.includes(r)))
    return next(forbidden(`Required roles: ${roles.join(', ')}`))
  next()
}
