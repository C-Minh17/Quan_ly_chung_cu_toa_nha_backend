import mongoose from 'mongoose'
import createModel from './base'

const amenityBookingsSchema = createModel(
    'AmenityBooking',
    'amenity_bookings',
    {
        amenities_code: { type: String, required: true },
        id: { type: String, required: true, unique: true },
        amenity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Amenities', required: true },
        resident_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
        booking_date: { type: Date, required: true },
        start_time: { type: Date, required: true },
        end_time: { type: Date, required: true },
        num_people: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'cancelled'],
            default: 'pending'
        },
        created_at: {
            type: Date, required: true, default: Date.now
        }
    },
)

export default amenityBookingsSchema