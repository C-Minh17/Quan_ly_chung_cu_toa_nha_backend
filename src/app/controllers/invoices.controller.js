import * as invoicesService from '@/app/services/invoices.service'

export const generateMonthlyInvoicesController = async (req, res) => {
    try {
        const { billing_month, billing_year } = req.body
        
        if (!billing_month || !billing_year) {
            return res.status(400).json({
                success: false,
                message: 'billing_month and billing_year are required'
            })
        }

        const data = await invoicesService.generateMonthlyInvoices({ billing_month, billing_year })

        return res.status(200).json({
            success: true,
            message: 'Invoices generated successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Failed to generate invoices',
            error: err.message
        })
    }
}

export const getInvoicesController = async (req, res) => {
    try {
        const data = await invoicesService.getInvoices(req.query)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const createInvoiceController = async (req, res) => {
    try {
        const data = await invoicesService.createInvoice(req.body)
        return res.status(200).json({ success: true, message: 'Create invoice successfully', data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getInvoiceByIdController = async (req, res) => {
    try {
        const data = await invoicesService.getInvoiceById(req.params.id)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const deleteInvoiceController = async (req, res) => {
    try {
        const data = await invoicesService.deleteInvoice(req.params.id)
        return res.status(200).json({ success: true, ...data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getMyInvoicesController = async (req, res) => {
    try {
        // Assume req.user has user _id
        const user_id = req.currentUser._id
        const data = await invoicesService.getMyInvoices(user_id)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getMyInvoiceByIdController = async (req, res) => {
    try {
        const user_id = req.currentUser._id
        const data = await invoicesService.getMyInvoiceById(user_id, req.params.id)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getOverdueInvoicesController = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5
        const data = await invoicesService.getOverdueInvoices({ limit })
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}

export const getRevenueStatsController = async (req, res) => {
    try {
        const monthsLimit = req.query.months_limit ? parseInt(req.query.months_limit, 10) : 6
        const data = await invoicesService.getRevenueStats({ monthsLimit })
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}


export const exportInvoicePDFController = async (req, res) => {
    try {
        const data = await invoicesService.exportInvoicePDF(req.params.id)
        return res.status(200).json({ success: true, data })
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message, error: err.message })
    }
}
