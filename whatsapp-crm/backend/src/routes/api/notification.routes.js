import { Router } from 'express'
import { validate } from '#middlewares/validate.middleware.js'
import { sendNotificationSchema } from '#validations/notification.validation/sendNotification.validation.js'
import {
  sendNotification, getInbox, getUnreadCount,
  markAsRead, markAllAsRead, deleteNotification, getSent,
} from '#controllers/notification.controller.js'

const router = Router()

router.post('/', validate(sendNotificationSchema), sendNotification)
router.get('/inbox', getInbox)
router.get('/unread-count', getUnreadCount)
router.get('/sent', getSent)
router.patch('/read-all', markAllAsRead)
router.patch('/:id/read', markAsRead)
router.delete('/:id', deleteNotification)

export default router
