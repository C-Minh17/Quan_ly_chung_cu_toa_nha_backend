import mongoose from 'mongoose'
import createModel from './base'

const vehicleSchema = createModel(
    'Vehicle',
    'vehicles',
    {
        resident_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
        license_plate: { type: String, default: '' },
        vehicle_type: {
            type: String,
            enum: ['motorbike', 'car', 'bicycle'],
            default: 'motorbike',
        },
        brand: { type: String, default: '' },
        color: { type: String, default: '' },
        card_number: { type: String, default: '' },
        is_active: { type: Boolean, default: true },
        deleted: { type: Boolean, default: false },
        created_at: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }
)

export default vehicleSchema
