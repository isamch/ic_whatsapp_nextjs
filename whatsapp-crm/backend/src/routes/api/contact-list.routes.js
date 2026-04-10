import { Router } from 'express'
import { hasPermission } from '#middlewares/permission.middleware.js'
import * as ContactListController from '#controllers/contact-list.controller.js'
import { CONTACT_LIST_PERMISSIONS } from '#permissions/category.permission.js'

const router = Router()

router.get('/', hasPermission(CONTACT_LIST_PERMISSIONS.READ), ContactListController.getAllContactLists)
router.post('/', hasPermission(CONTACT_LIST_PERMISSIONS.CREATE), ContactListController.createContactList)
router.patch('/:id', hasPermission(CONTACT_LIST_PERMISSIONS.UPDATE), ContactListController.updateContactList)
router.delete('/:id', hasPermission(CONTACT_LIST_PERMISSIONS.DELETE), ContactListController.deleteContactList)

export default router
