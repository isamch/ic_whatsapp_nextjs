import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import * as ContactListService from '#services/contact-list.service.js'

export const getAllContactLists = asyncHandler(async (req, res) => {
  const lists = await ContactListService.findAll(req.user._id, req.query.categoryId)
  successResponse(res, 200, 'Contact lists fetched', { lists })
})

export const createContactList = asyncHandler(async (req, res) => {
  const list = await ContactListService.create(req.user._id, req.body)
  successResponse(res, 201, 'Contact list created', { list })
})

export const updateContactList = asyncHandler(async (req, res) => {
  const list = await ContactListService.updateById(req.user._id, req.params.id, req.body)
  successResponse(res, 200, 'Contact list updated', { list })
})

export const deleteContactList = asyncHandler(async (req, res) => {
  await ContactListService.deleteById(req.user._id, req.params.id)
  successResponse(res, 200, 'Contact list deleted', null)
})
