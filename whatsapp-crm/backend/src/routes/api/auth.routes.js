import { Router } from 'express'
import { protect } from '#middlewares/auth.middleware.js'
import { validate } from '#middlewares/validate.middleware.js'
import { registerSchema } from '#validations/auth.validation/register.validation.js'
import { loginSchema } from '#validations/auth.validation/login.validation.js'
import * as AuthController from '#controllers/auth.controller.js'

const router = Router()

router.post('/register', validate(registerSchema), AuthController.register)
router.post('/login', validate(loginSchema), AuthController.login)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/logout', protect, AuthController.logout)

export default router
