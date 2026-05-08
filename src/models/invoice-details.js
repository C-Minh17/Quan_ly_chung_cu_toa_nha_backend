import mongoose from 'mongoose'
import createModel from './base'

const invoiceDetailSchema = createModel(
    'InvoiceDetails',
    'invoice_details',
    {
        invoice_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Invoices', required: true },
        fee_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeTypes', required: true },
        quantity:    { type: Number, required: true },
        unit_price:  { type: Number, required: true },
        amount:      { type: Number, required: true },
    }
)

export default invoiceDetailSchema
