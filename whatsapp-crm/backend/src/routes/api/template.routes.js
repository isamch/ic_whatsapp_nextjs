import { Router } from 'express'
import { hasPermission } from '#middlewares/permission.middleware.js'
import { validate } from '#middlewares/validate.middleware.js'
import { createTemplateSchema } from '#validations/template.validation/createTemplate.validation.js'
import { updateTemplateSchema } from '#validations/template.validation/updateTemplate.validation.js'
import * as TemplateController from '#controllers/template.controller.js'

const router = Router()

router.get('/',       hasPermission('templates:read'),   TemplateController.getAllTemplates)
router.get('/:id',    hasPermission('templates:read'),   TemplateController.getTemplate)
router.post('/',      hasPermission('templates:create'), validate(createTemplateSchema), TemplateController.createTemplate)
router.patch('/:id',  hasPermission('templates:update'), validate(updateTemplateSchema), TemplateController.updateTemplate)
router.delete('/:id', hasPermission('templates:delete'), TemplateController.deleteTemplate)

export default router
