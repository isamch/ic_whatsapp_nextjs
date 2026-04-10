import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import * as CategoryService from '#services/category.service.js'

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryService.findAll(req.user._id)
  successResponse(res, 200, 'Categories fetched', { categories })
})

export const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.create(req.user._id, req.body)
  successResponse(res, 201, 'Category created', { category })
})

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.updateById(req.user._id, req.params.id, req.body)
  successResponse(res, 200, 'Category updated', { category })
})

export const deleteCategory = asyncHandler(async (req, res) => {
  await CategoryService.deleteById(req.user._id, req.params.id)
  successResponse(res, 200, 'Category deleted', null)
})
