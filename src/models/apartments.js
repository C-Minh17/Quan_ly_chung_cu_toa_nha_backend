import mongoose from 'mongoose'
import createModel from './base'

const apartmentSchema = createModel(
    'Apartment',
    'apartments',
    {
        apartment_code: { type: String, required: true, unique: true },
        floor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
        area: { type: Number, required: true },
        num_bedrooms: { type: Number, required: true },
        num_bathrooms: { type: Number, required: true },
        apartment_type: { type: String, required: true },
        status: { type: String, required: true },
        price: { type: Number, required: true },
        created_at: {
            type: Date, required: true, default: Date.now
        }
    }
)

export default apartmentSchema