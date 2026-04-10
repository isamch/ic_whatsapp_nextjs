import { Router } from 'express'
import { protect, checkIsActive } from '#middlewares/auth.middleware.js'
import { authLimiter } from '#config/rate-limit.js'
import authRoutes from './api/auth.routes.js'
import userRoutes from './api/user.routes.js'
import roleRoutes from './api/role.routes.js'
import userPermissionRoutes from './api/user-permission.routes.js'
import whatsappRoutes from './api/whatsapp.routes.js'
import categoryRoutes from './api/category.routes.js'
import contactListRoutes from './api/contact-list.routes.js'
import contactRoutes from './api/contact.routes.js'
import templateRoutes from './api/template.routes.js'
import campaignRoutes from './api/campaign.routes.js'
import notificationRoutes from './api/notification.routes.js'
import dashboardRoutes from './api/dashboard.routes.js'


const router = Router()

router.use('/auth', authLimiter, authRoutes)

router.use(protect, checkIsActive)

router.use('/users', userRoutes)
router.use('/roles', roleRoutes)
router.use('/users/:id', userPermissionRoutes)
router.use('/whatsapp', whatsappRoutes)
router.use('/categories', categoryRoutes)
router.use('/contact-lists', contactListRoutes)
router.use('/contacts', contactRoutes)
router.use('/templates', templateRoutes)
router.use('/campaigns', campaignRoutes)
router.use('/notifications', notificationRoutes)
router.use('/dashboard', dashboardRoutes)


export default router
