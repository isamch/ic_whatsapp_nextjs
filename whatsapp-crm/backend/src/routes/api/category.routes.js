import { Router } from 'express'
import { hasPermission } from '#middlewares/permission.middleware.js'
import * as CategoryController from '#controllers/category.controller.js'
import { CATEGORY_PERMISSIONS } from '#permissions/category.permission.js'

const router = Router()

router.get('/', hasPermission(CATEGORY_PERMISSIONS.READ), CategoryController.getAllCategories)
router.post('/', hasPermission(CATEGORY_PERMISSIONS.CREATE), CategoryController.createCategory)
router.patch('/:id', hasPermission(CATEGORY_PERMISSIONS.UPDATE), CategoryController.updateCategory)
router.delete('/:id', hasPermission(CATEGORY_PERMISSIONS.DELETE), CategoryController.deleteCategory)

export default router
