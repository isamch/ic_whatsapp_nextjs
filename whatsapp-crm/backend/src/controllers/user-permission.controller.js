import asyncHandler from '#utils/async-handler.js'
import { notFound } from '#utils/app-error.js'
import { successResponse } from '#utils/api-response.js'
import * as UserPermissionService from '#services/user-permission.service.js'

export const assignRoles = asyncHandler(async (req, res) => {
  const user = await UserPermissionService.assignRoles(req.params.id, req.body.roles)
  if (!user) throw notFound('User not found')
  successResponse(res, 200, 'Roles assigned', { user })
})

export const revokeRoles = asyncHandler(async (req, res) => {
  const user = await UserPermissionService.revokeRoles(req.params.id, req.body.roles)
  if (!user) throw notFound('User not found')
  successResponse(res, 200, 'Roles revoked', { user })
})

export const addExtraPermissions = asyncHandler(async (req, res) => {
  const user = await UserPermissionService.addExtraPermissions(req.params.id, req.body.permissions)
  if (!user) throw notFound('User not found')
  successResponse(res, 200, 'Extra permissions added', { user })
})

export const removeExtraPermissions = asyncHandler(async (req, res) => {
  const user = await UserPermissionService.removeExtraPermissions(req.params.id, req.body.permissions)
  if (!user) throw notFound('User not found')
  successResponse(res, 200, 'Extra permissions removed', { user })
})

export const addRevokedPermissions = asyncHandler(async (req, res) => {
  const user = await UserPermissionService.addRevokedPermissions(req.params.id, req.body.permissions)
  if (!user) throw notFound('User not found')
  successResponse(res, 200, 'Permissions revoked from user', { user })
})

export const removeRevokedPermissions = asyncHandler(async (req, res) => {
  const user = await UserPermissionService.removeRevokedPermissions(req.params.id, req.body.permissions)
  if (!user) throw notFound('User not found')
  successResponse(res, 200, 'Revoked permissions removed', { user })
})
