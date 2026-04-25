import mongoose from 'mongoose'
import createModel from './base'

const MaintenanceRequestsSchema = createModel(
    'MaintenanceRequests',
    'maintenance_requests',
    {
        Maintenance_Requests_code: { type: String, required: true, unique: true },
        id: { type: String, required: true, unique: true },
        apartment_id: { type: mongoose.Schema.ObjectId, ref: 'Apartment', required: true },
        resident_id: { type: mongoose.Schema.ObjectId, ref: 'Resident', required: true },
        front_maintenance_images: { type: String, default: '' },
        back_maintenance_images: { type: String, default: '' },
        title: { type: String, default: ' ' },
        description: { type: String, required: true, default: ' ' },
        category: {
            type: String,
            enum: ['electrical', 'plumbing', 'structure', 'appliance', 'other'],
            default: 'none'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['new', 'assigned', 'in_progress', 'completed', 'closed'],
            default: 'new'
        },
        progress_note: { type: String, default: '' },
        closing_note: { type: String, default: '' },
        closed_at: { type: Date, default: null },
        assigned_to: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true },
        feedback: { type: String, required: true, default: '' },
        create_at: {
            type: Date, required: true, default: Date.now
        }
    }
)
export default MaintenanceRequestsSchema