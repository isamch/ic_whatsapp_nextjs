import { Router } from 'express'
import multer from 'multer'
import { hasPermission } from '#middlewares/permission.middleware.js'
import { validate } from '#middlewares/validate.middleware.js'
import { createContactSchema } from '#validations/contact.validation/createContact.validation.js'
import { updateContactSchema } from '#validations/contact.validation/updateContact.validation.js'
import * as ContactController from '#controllers/contact.controller.js'
import { CONTACT_PERMISSIONS } from '#permissions/contact.permission.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } })

router.get('/', hasPermission(CONTACT_PERMISSIONS.READ), ContactController.getAllContacts)
router.post('/', hasPermission(CONTACT_PERMISSIONS.CREATE), validate(createContactSchema), ContactController.createContact)
router.post('/import', hasPermission(CONTACT_PERMISSIONS.CREATE), upload.single('file'), ContactController.importContacts)
router.post('/validate', hasPermission(CONTACT_PERMISSIONS.UPDATE), ContactController.validateContacts)
router.delete('/clear-invalid', hasPermission(CONTACT_PERMISSIONS.DELETE), ContactController.clearInvalidContacts)
router.patch('/:id', hasPermission(CONTACT_PERMISSIONS.UPDATE), validate(updateContactSchema), ContactController.updateContact)
router.delete('/:id', hasPermission(CONTACT_PERMISSIONS.DELETE), ContactController.deleteContact)

export default router
