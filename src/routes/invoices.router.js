import express from 'express'
import * as invoicesController from '@/app/controllers/invoices.controller'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = express.Router()

router.get('/', asyncHandler(invoicesController.getInvoicesController))
router.post('/generate', asyncHandler(invoicesController.generateMonthlyInvoicesController))
router.post('/generate-monthly', asyncHandler(invoicesController.generateMonthlyInvoicesController)) // fallback alias
router.post('/', asyncHandler(invoicesController.createInvoiceController))

router.get('/me', asyncHandler(checkValidToken), asyncHandler(invoicesController.getMyInvoicesController))
router.get('/me/:id', asyncHandler(checkValidToken), asyncHandler(invoicesController.getMyInvoiceByIdController))

router.get('/overdue', asyncHandler(invoicesController.getOverdueInvoicesController))
router.get('/stats/revenue', asyncHandler(invoicesController.getRevenueStatsController))

router.get('/:id', asyncHandler(invoicesController.getInvoiceByIdController))
router.get('/:id/pdf', asyncHandler(invoicesController.exportInvoicePDFController))
router.delete('/:id', asyncHandler(invoicesController.deleteInvoiceController))

export default router
