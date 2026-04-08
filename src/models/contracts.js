import mongoose from 'mongoose'
import createModel from './base'

const contractSchema = createModel(
    'Contract',
    'contracts',
    {
        apartment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
        resident_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
        contract_code: { type: String, required: true, unique: true },
        contract_type: {
            type: String,
            enum: ['purchase', 'rent'],
            required: true
        },
        start_date: { type: Date },
        end_date: { type: Date },
        monthly_price: { type: Number },
        deposit: { type: Number },
        status: {
            type: String,
            enum: ['active', 'expired', 'terminated'],
            default: 'active'
        },
        file_url: { type: String },
        notes: { type: String },
        id: { type: String, required: false },
        created_at: {
            type: Date, required: true, default: Date.now
        },
    }
)

export default contractSchema
