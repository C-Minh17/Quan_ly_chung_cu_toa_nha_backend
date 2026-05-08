import mongoose from 'mongoose'
import createModel from './base'

const utilityReadingSchema = createModel(
    'UtilityReading',
    'utilityReading',
    {
        apartment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
        fee_type_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'FeeTypes',  required: true },
        reading_month:    { type: Number, required: true },
        reading_year:     { type: Number, required: true },
        previous_reading: { type: Number, default: null },
        current_reading:  { type: Number, default: null },
        consumption:      { type: Number, default: null },
        recorded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        recorded_at: { type: Date, default: Date.now },
    }
)

export default utilityReadingSchema