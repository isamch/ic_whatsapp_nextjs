import { Router } from 'express'
import { hasPermission } from '#middlewares/permission.middleware.js'
import * as RoleController from '#controllers/role.controller.js'
import { ROLE_PERMISSIONS } from '#permissions/role.permission.js'

const router = Router()

router.get('/', hasPermission(ROLE_PERMISSIONS.READ), RoleController.getAllRoles)
router.get('/:id', hasPermission(ROLE_PERMISSIONS.READ), RoleController.getRole)
router.post('/', hasPermission(ROLE_PERMISSIONS.CREATE), RoleController.createRole)
router.patch('/:id', hasPermission(ROLE_PERMISSIONS.UPDATE), RoleController.updateRole)
router.delete('/:id', hasPermission(ROLE_PERMISSIONS.DELETE), RoleController.deleteRole)

router.post('/:id/permissions', hasPermission(ROLE_PERMISSIONS.UPDATE), RoleController.addPermissionsToRole)
router.delete('/:id/permissions', hasPermission(ROLE_PERMISSIONS.UPDATE), RoleController.removePermissionsFromRole)

export default router
