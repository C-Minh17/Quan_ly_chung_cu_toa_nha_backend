import express from 'express'
import * as notificationController from '@/app/controllers/notification.controller'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

// Admin routes
router.post('/', asyncHandler(notificationController.createNotificationController))
router.get('/page', asyncHandler(notificationController.getNotificationPageController))
router.delete('/:id', asyncHandler(notificationController.deleteNotificationController))
router.get('/:id/receiver/page', asyncHandler(notificationController.getReceiversPageController))

// Client routes
router.post('/onesignal/init', asyncHandler(checkValidToken), asyncHandler(notificationController.initOneSignalController))
router.post('/init', asyncHandler(checkValidToken), asyncHandler(notificationController.initOneSignalController)) // duplicate fallback mapping
router.get('/me/page', asyncHandler(checkValidToken), asyncHandler(notificationController.getMyNotificationsController))
router.post('/read', asyncHandler(checkValidToken), asyncHandler(notificationController.readNotificationController))

export default router
