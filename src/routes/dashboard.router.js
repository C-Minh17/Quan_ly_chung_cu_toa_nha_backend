import express from 'express'
import * as dashboardController from '@/app/controllers/dashboard.controller'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

router.get('/metrics', asyncHandler(dashboardController.getDashboardMetricsController))
router.get('/activities', asyncHandler(dashboardController.getRecentActivitiesController))

export default router
