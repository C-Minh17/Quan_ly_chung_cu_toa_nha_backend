import express from 'express'
import * as residentDashboardController from '@/app/controllers/residentDashboard.controller'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

// Ensure all resident dashboard APIs are authenticated
router.use(asyncHandler(checkValidToken))

router.get('/metrics', asyncHandler(residentDashboardController.getMetrics))
router.get('/bills', asyncHandler(residentDashboardController.getBills))
router.get('/bookings', asyncHandler(residentDashboardController.getBookings))
router.get('/maintenance', asyncHandler(residentDashboardController.getMaintenance))

export default router
