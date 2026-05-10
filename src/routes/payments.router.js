import express from 'express'
import * as paymentsController from '@/app/controllers/payments.controller'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

router.post('/lookup', asyncHandler(paymentsController.lookupInvoiceController))
router.post('/', asyncHandler(checkValidToken), asyncHandler(paymentsController.createPaymentController))
router.post('/cron-overdue', asyncHandler(paymentsController.triggerCronOverdueInvoicesController))

router.get('/', asyncHandler(paymentsController.getPaymentsController))
router.get('/me', asyncHandler(checkValidToken), asyncHandler(paymentsController.getMyPaymentsController))
router.get('/invoice/:invoiceId', asyncHandler(paymentsController.getPaymentsByInvoiceIdController))
router.get('/:id', asyncHandler(paymentsController.getPaymentByIdController))

export default router
