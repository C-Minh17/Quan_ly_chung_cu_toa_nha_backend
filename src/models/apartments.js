import mongoose from 'mongoose'
import createModel from './base'

const apartmentSchema = createModel(
    'Apartment',
    'apartments',
    {
        apartment_code: { type: String },
        id: { type: String, required: true, unique: true },
        floor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
        building_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
        area: { type: Number, required: true },
        num_bedrooms: { type: Number, required: true },
        num_bathrooms: { type: Number, required: true },
        apartment_type: { type: String, required: true },
        status: {
            type: String,
            enum: ['occupied', 'vacant', 'maintenance'],
            default: 'vacant'
        },
        price: { type: Number, required: true },
        contract_number: { type: String, default: '' },
        contract_start_date: { type: Date },
        contract_end_date: { type: Date },
        contract_status: {
            type: String,
            enum: ['active', 'expired', 'terminated', 'none'],
            default: 'none'
        },
        contract_file: { type: String, default: '' },
        created_at: {
            type: Date, required: true, default: Date.now
        }
    }
)
apartmentSchema.schema.index({ building_id: 1, apartment_code: 1 }, { unique: true })

export default apartmentSchema