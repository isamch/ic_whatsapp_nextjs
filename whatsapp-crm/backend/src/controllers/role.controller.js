import asyncHandler from '#utils/async-handler.js'
import { notFound } from '#utils/app-error.js'
import { successResponse } from '#utils/api-response.js'
import * as RoleService from '#services/role.service.js'

export const getAllRoles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const result = await RoleService.findAll({ page: +page, limit: +limit })
  successResponse(res, 200, 'Roles fetched', result)
})

export const getRole = asyncHandler(async (req, res) => {
  const role = await RoleService.findById(req.params.id)
  if (!role) throw notFound('Role not found')
  successResponse(res, 200, 'Role fetched', { role })
})

export const createRole = asyncHandler(async (req, res) => {
  const role = await RoleService.create(req.body)
  successResponse(res, 201, 'Role created', { role })
})

export const updateRole = asyncHandler(async (req, res) => {
  const role = await RoleService.updateById(req.params.id, req.body)
  if (!role) throw notFound('Role not found')
  successResponse(res, 200, 'Role updated', { role })
})

export const deleteRole = asyncHandler(async (req, res) => {
  await RoleService.deleteById(req.params.id)
  successResponse(res, 204, 'Role deleted', null)
})

export const addPermissionsToRole = asyncHandler(async (req, res) => {
  const role = await RoleService.addPermissions(req.params.id, req.body.permissions)
  if (!role) throw notFound('Role not found')
  successResponse(res, 200, 'Permissions added', { role })
})

export const removePermissionsFromRole = asyncHandler(async (req, res) => {
  const role = await RoleService.removePermissions(req.params.id, req.body.permissions)
  if (!role) throw notFound('Role not found')
  successResponse(res, 200, 'Permissions removed', { role })
})
