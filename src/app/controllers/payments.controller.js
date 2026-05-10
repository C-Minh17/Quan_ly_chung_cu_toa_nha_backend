import * as paymentsService from '@/app/services/payments.service'

export const lookupInvoiceController = async (req, res) => {
    try {
        const data = await paymentsService.lookupInvoice(req.body)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const createPaymentController = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            received_by: req.body.received_by || (req.currentUser ? req.currentUser._id : null)
        }

        const data = await paymentsService.createPayment(payload)
        return res.status(200).json({ success: true, message: 'Thanh toán thành công', data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const triggerCronOverdueInvoicesController = async (req, res) => {
    try {
        const data = await paymentsService.cronOverdueInvoices()
        return res.status(200).json({ success: true, message: 'Cập nhật trạng thái overdue thành công', data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getPaymentsByInvoiceIdController = async (req, res) => {
    try {
        const data = await paymentsService.getPaymentsByInvoiceId(req.params.invoiceId)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getMyPaymentsController = async (req, res) => {
    try {
        const user_id = req.currentUser._id
        const data = await paymentsService.getMyPayments(user_id)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getPaymentByIdController = async (req, res) => {
    try {
        const data = await paymentsService.getPaymentById(req.params.id)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getPaymentsController = async (req, res) => {
    try {
        const data = await paymentsService.getPayments(req.query)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}
