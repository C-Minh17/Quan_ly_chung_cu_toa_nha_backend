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
        title: { type: String, required: true, default: '' },
        description: { type: String, default: '' },
        category: {
            type: String,
            enum: ['electrical', 'plumbing', 'structure', 'appliance', 'other'],
            default: 'other'
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
        assigned_to: { type: mongoose.Schema.ObjectId, ref: 'User' },
        rating: { type: Number },
        feedback: { type: String, default: '' },
        created_at: {
            type: Date, required: true, default: Date.now
        },
        completed_at: { type: Date, default: null }
    }
)
export default MaintenanceRequestsSchema