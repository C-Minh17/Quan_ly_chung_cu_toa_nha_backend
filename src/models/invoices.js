import mongoose from 'mongoose'
import createModel from './base'

const invoiceSchema = createModel(
    'Invoices',
    'invoices',
    {
        apartment_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
        invoice_code:  { type: String, required: true, unique: true },
        billing_month: { type: Number, required: true },
        billing_year:  { type: Number, required: true },
        total_amount:  { type: Number, required: true },
        paid_amount:   { type: Number, default: 0 },
        due_date:      { type: Date },
        status:        { type: String, default: 'unpaid', enum: ['unpaid', 'partial', 'paid', 'overdue'] },
    }
)

export default invoiceSchema
