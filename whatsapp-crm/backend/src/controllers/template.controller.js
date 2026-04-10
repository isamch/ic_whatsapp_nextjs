import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import * as TemplateService from '#services/template.service.js'

export const getAllTemplates = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const result = await TemplateService.findAll(req.user._id, { page: +page, limit: +limit })
  successResponse(res, 200, 'Templates fetched', result)
})

export const getTemplate = asyncHandler(async (req, res) => {
  const template = await TemplateService.findById(req.user._id, req.params.id)
  successResponse(res, 200, 'Template fetched', { template })
})

export const createTemplate = asyncHandler(async (req, res) => {
  const template = await TemplateService.create(req.user._id, req.body)
  successResponse(res, 201, 'Template created', { template })
})

export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await TemplateService.updateById(req.user._id, req.params.id, req.body)
  successResponse(res, 200, 'Template updated', { template })
})

export const deleteTemplate = asyncHandler(async (req, res) => {
  await TemplateService.deleteById(req.user._id, req.params.id)
  successResponse(res, 200, 'Template deleted', null)
})
