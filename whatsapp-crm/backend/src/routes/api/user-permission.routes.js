import { Router } from 'express'
import { protect } from '#middlewares/auth.middleware.js'
import { hasPermission } from '#middlewares/permission.middleware.js'
import * as UserPermissionController from '#controllers/user-permission.controller.js'
import { USER_PERMISSIONS } from '#permissions/user.permission.js'

const router = Router({ mergeParams: true })

router.use(protect)

// roles on user
router.post('/roles', hasPermission(USER_PERMISSIONS.UPDATE), UserPermissionController.assignRoles)
router.delete('/roles', hasPermission(USER_PERMISSIONS.UPDATE), UserPermissionController.revokeRoles)

// extra permissions on user
router.post('/extra-permissions', hasPermission(USER_PERMISSIONS.UPDATE), UserPermissionController.addExtraPermissions)
router.delete('/extra-permissions', hasPermission(USER_PERMISSIONS.UPDATE), UserPermissionController.removeExtraPermissions)

// revoked permissions on user
router.post('/revoked-permissions', hasPermission(USER_PERMISSIONS.UPDATE), UserPermissionController.addRevokedPermissions)
router.delete('/revoked-permissions', hasPermission(USER_PERMISSIONS.UPDATE), UserPermissionController.removeRevokedPermissions)

export default router
