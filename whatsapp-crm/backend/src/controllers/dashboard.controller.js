import asyncHandler from '#utils/async-handler.js'
import { successResponse } from '#utils/api-response.js'
import { getDashboardStats } from '#services/dashboard.service.js'

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user._id)
  successResponse(res, 200, 'Dashboard stats fetched', stats)
})
