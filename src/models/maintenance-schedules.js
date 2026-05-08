import mongoose from 'mongoose'
import createModel from './base'

const MaintenanceSchedulesSchema = createModel(
    'MaintenanceSchedules',
    'maintenance_schedules',
    {
        Maintenance_Schedules_id: { type: String, required: true, unique: true },
        id: { type: String, required: true, unique: true },
        title: { type: String, required: true, default: '' },
        description: { type: String, required: true, default: '' },
        frequency: {
            type: String,
            enum: ['once', 'weekly', 'monthly', 'quarterly', 'yearly'],
            default: 'none'
        },
        scheduled_date: { type: Date, default: Date.now },
        assigned_to: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled'],
            default: 'scheduled'
        },
        created_at: { type: Date, default: Date.now, required: true }
    }
)

export default MaintenanceSchedulesSchema