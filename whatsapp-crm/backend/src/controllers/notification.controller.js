import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import { notFound } from '#utils/app-error.js'
import * as notifService from '#services/notification.service.js'

export const sendNotification = asyncHandler(async (req, res) => {
  const notif = await notifService.send(req.user._id, req.body)
  successResponse(res, 201, 'Notification sent', notif)
})

export const getInbox = asyncHandler(async (req, res) => {
  const result = await notifService.getInbox(req.user._id, req.query)
  successResponse(res, 200, 'Inbox fetched', result)
})

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notifService.getUnreadCount(req.user._id)
  successResponse(res, 200, 'Unread count', { count })
})

export const markAsRead = asyncHandler(async (req, res) => {
  const notif = await notifService.markAsRead(req.user._id, req.params.id)
  if (!notif) throw notFound('Notification not found')
  successResponse(res, 200, 'Marked as read', notif)
})

export const markAllAsRead = asyncHandler(async (req, res) => {
  await notifService.markAllAsRead(req.user._id)
  successResponse(res, 200, 'All marked as read', null)
})

export const deleteNotification = asyncHandler(async (req, res) => {
  const notif = await notifService.deleteFromInbox(req.user._id, req.params.id)
  if (!notif) throw notFound('Notification not found')
  successResponse(res, 200, 'Notification deleted', null)
})

export const getSent = asyncHandler(async (req, res) => {
  const result = await notifService.getSent(req.user._id, req.query)
  successResponse(res, 200, 'Sent notifications fetched', result)
})
