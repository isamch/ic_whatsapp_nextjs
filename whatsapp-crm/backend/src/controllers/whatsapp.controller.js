import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import { notFound } from '#utils/app-error.js'
import * as WhatsappService from '#services/whatsapp.service.js'

export const connect = asyncHandler(async (req, res) => {
  const result = await WhatsappService.connect(req.user._id)
  successResponse(res, 200, result.message, null)
})

export const getQR = asyncHandler(async (req, res) => {
  const qrImage = await WhatsappService.getQR(req.user._id)
  if (!qrImage) throw notFound('QR code not available yet')
  successResponse(res, 200, 'QR code fetched', { qr: qrImage })
})

export const getStatus = asyncHandler(async (req, res) => {
  const status = WhatsappService.getStatus(req.user._id)
  successResponse(res, 200, 'Status fetched', { status })
})

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await WhatsappService.getProfile(req.user._id)
  if (!profile) throw notFound('WhatsApp not connected')
  successResponse(res, 200, 'Profile fetched', { profile })
})

export const disconnect = asyncHandler(async (req, res) => {
  await WhatsappService.disconnect(req.user._id)
  successResponse(res, 200, 'Disconnected successfully', null)
})

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await WhatsappService.getConversations(req.user._id)
  successResponse(res, 200, 'Conversations fetched', { conversations })
})

export const getMessages = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query
  const result = await WhatsappService.getMessages(req.user._id, req.params.chatId, { limit: +limit })
  successResponse(res, 200, 'Messages fetched', result)
})

export const sendMessage = asyncHandler(async (req, res) => {
  const { body } = req.body
  if (!body) throw notFound('Message body is required')
  const message = await WhatsappService.sendMessage(req.user._id, req.params.chatId, body)
  successResponse(res, 201, 'Message sent', { message })
})
