import express from 'express'
import * as staffDashboardController from '@/app/controllers/staffDashboard.controller'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { checkUserRole } from '@/app/middleware/user/role.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

// Ensure all staff dashboard APIs are authenticated and restricted to staff/management roles
router.use(asyncHandler(checkValidToken))
router.use(asyncHandler(checkUserRole('STAFF', 'SUPER_ADMIN', 'MANAGER')))

router.get('/metrics', asyncHandler(staffDashboardController.getMetrics))
router.get('/tasks', asyncHandler(staffDashboardController.getTasks))
router.put('/tasks/:id', asyncHandler(staffDashboardController.updateTask))
router.patch('/tasks/:id', asyncHandler(staffDashboardController.updateTask))
router.get('/recent-logs', asyncHandler(staffDashboardController.getRecentLogs))

export default router
