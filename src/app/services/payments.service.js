import { Invoices, InvoiceDetails, Payments, Resident } from '@/models'
import { abort } from '@/utils/helpers'
import mongoose from 'mongoose'

export const lookupInvoice = async ({ invoice_code, apartment_id, billing_month, billing_year }) => {
    const query = {}
    if (invoice_code) {
        query.invoice_code = invoice_code
    } else if (apartment_id && billing_month && billing_year) {
        query.apartment_id = apartment_id
        query.billing_month = billing_month
        query.billing_year = billing_year
    } else {
        abort(400, 'Cần cung cấp invoice_code hoặc (apartment_id, billing_month, billing_year)')
    }

    const invoice = await Invoices.findOne(query).lean()
    if (!invoice) {
        abort(404, 'Không tìm thấy hóa đơn')
    }

    const remaining = invoice.total_amount - (invoice.paid_amount || 0)

    const details = await InvoiceDetails.find({ invoice_id: invoice._id }).populate('fee_type_id').lean()
    const payments = await Payments.find({ invoice_id: invoice._id }).populate('received_by').sort({ paid_at: -1 }).lean()

    return {
        ...invoice,
        remaining,
        details,
        payments,
        message: invoice.status === 'paid' ? 'Hóa đơn đã được thanh toán đủ' : 'Hóa đơn chưa thanh toán đủ'
    }
}

export const createPayment = async (data) => {
    const { invoice_id, amount, payment_method, transaction_code, note, received_by } = data

    if (!invoice_id || !amount || !payment_method) {
        abort(400, 'Thiếu thông tin bắt buộc: invoice_id, amount, payment_method')
    }

    if (Number(amount) <= 0) {
        abort(400, 'Số tiền thanh toán phải lớn hơn 0')
    }

    if (payment_method !== 'cash' && !transaction_code) {
        abort(400, 'Bắt buộc nhập transaction_code nếu thanh toán không phải tiền mặt')
    }

    if (transaction_code) {
        const existingPayment = await Payments.findOne({ transaction_code, invoice_id }).lean()
        if (existingPayment) {
            return existingPayment
        }
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const invoice = await Invoices.findById(invoice_id).session(session)
        if (!invoice) {
            abort(404, 'Không tìm thấy hóa đơn')
        }

        if (invoice.status === 'paid') {
            abort(400, 'Hóa đơn đã thanh toán đủ')
        }

        const remaining = invoice.total_amount - (invoice.paid_amount || 0)
        if (Number(amount) > remaining) {
            abort(400, `Số tiền thanh toán không được vượt quá số tiền còn lại (${remaining})`)
        }

        const [payment] = await Payments.create([{
            invoice_id,
            amount: Number(amount),
            payment_method,
            transaction_code,
            note,
            received_by
        }], { session })

        const allPayments = await Payments.find({ invoice_id }).session(session)
        const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0)

        invoice.paid_amount = totalPaid

        if (invoice.paid_amount === 0) {
            invoice.status = 'unpaid'
        } else if (invoice.paid_amount > 0 && invoice.paid_amount < invoice.total_amount) {
            invoice.status = 'partial'
        } else if (invoice.paid_amount >= invoice.total_amount) {
            invoice.status = 'paid'
        }

        await invoice.save({ session })

        await session.commitTransaction()
        session.endSession()

        return payment
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

export const cronOverdueInvoices = async () => {
    // Chạy mỗi ngày lúc 00:01
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const result = await Invoices.updateMany(
        {
            status: { $in: ['unpaid', 'partial'] },
            due_date: { $lt: today }
        },
        {
            $set: { status: 'overdue' }
        }
    )

    return {
        updated_count: result.modifiedCount
    }
}


// Helper: Format payment response - tách invoice_id thành id + object, apartment_id cũng vậy
const formatPaymentResponse = (payment) => {
    if (!payment) return payment
    
    const { invoice_id, ...rest } = payment
    
    // Format invoice object
    let formattedInvoice = invoice_id
    if (invoice_id && typeof invoice_id === 'object') {
        const { apartment_id, ...invoiceRest } = invoice_id
        formattedInvoice = {
            ...invoiceRest,
            apartment_id: apartment_id?._id || apartment_id,
            apartment: apartment_id
        }
    }
    
    return {
        ...rest,
        invoice_id: invoice_id?._id || invoice_id,
        invoice: formattedInvoice
    }
}

// Helper: Format multiple payments
const formatPaymentsResponse = (payments) => {
    return payments.map(formatPaymentResponse)
}

export const getPaymentsByInvoiceId = async (invoiceId) => {
    const payments = await Payments.find({ invoice_id: invoiceId })
        .populate('received_by')
        .populate('invoice_id')
        .sort({ paid_at: -1 })
        .lean()
    
    return formatPaymentsResponse(payments)
}

export const getMyPayments = async (user_id) => {
    const residents = await Resident.find({ user_id }).lean()
    const apartmentIds = residents.map(r => r.apartment_id)

    if (apartmentIds.length === 0) {
        return []
    }

    const invoices = await Invoices.find({ apartment_id: { $in: apartmentIds } }).lean()
    const invoiceIds = invoices.map(i => i._id)

    const payments = await Payments.find({ invoice_id: { $in: invoiceIds } })
        .populate({
            path: 'invoice_id',
            populate: { path: 'apartment_id' }
        })
        .sort({ paid_at: -1 })
        .lean()

    return formatPaymentsResponse(payments)
}

export const getPaymentById = async (id) => {
    const payment = await Payments.findById(id)
        .populate('received_by')
        .populate({
            path: 'invoice_id',
            populate: { path: 'apartment_id' }
        })
        .lean()
    
    if (!payment) {
        abort(404, 'Không tìm thấy giao dịch thanh toán')
    }
    return formatPaymentResponse(payment)
}

export const getPayments = async (query) => {
    const { payment_method, invoice_id, received_by, sort } = query
    const filter = {}

    if (payment_method) filter.payment_method = payment_method
    if (invoice_id) filter.invoice_id = invoice_id
    if (received_by) filter.received_by = received_by

    const payments = await Payments.find(filter)
        .populate('received_by')
        .populate({
            path: 'invoice_id',
            populate: { path: 'apartment_id' }
        })
        .sort(sort || { paid_at: -1 })
        .lean()

    return formatPaymentsResponse(payments)
}

