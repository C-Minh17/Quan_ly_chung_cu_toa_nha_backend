import mongoose from 'mongoose'
import createModel from './base'

const residentSchema = createModel(
    'Resident',
    'residents',
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        apartment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
        id_card_number: { type: String, default: '' },
        id_card_date: { type: Date },
        id_card_place: { type: String, default: '' },
        id_card_front_image: { type: String, default: '' },
        id_card_back_image: { type: String, default: '' },
        date_of_birth: { type: Date },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            default: 'other',
        },
        permanent_address: { type: String, default: '' },
        move_in_date: { type: Date },
        move_out_date: { type: Date },
        resident_type: {
            type: String,
            enum: ['owner', 'tenant'],
            default: 'tenant',
        },
        is_primary: { type: Boolean, default: false },
        created_at: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }
)

export default residentSchema