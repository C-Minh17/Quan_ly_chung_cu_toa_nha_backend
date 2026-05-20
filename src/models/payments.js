import mongoose from 'mongoose'
import createModel from './base'

const paymentSchema = createModel(
    'Payments',
    'payments',
    {
        invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoices', required: true },
        amount: { type: Number, required: true },
        payment_method: { type: String, enum: ['cash', 'bank_transfer', 'momo', 'vnpay'], required: true },
        transaction_code: { type: String, default: '' },
        paid_at: { type: Date, default: Date.now },
        note: { type: String, default: '' },
        received_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
)

export default paymentSchema
