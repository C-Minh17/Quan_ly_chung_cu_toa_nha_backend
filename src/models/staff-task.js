import mongoose from 'mongoose'
import createModel from './base'

const staffTaskSchema = createModel(
    'StaffTask',
    'staff_tasks',
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        category: { type: String, default: 'Chung' },
        task_date: { type: Date, required: true }
    }
)

export default staffTaskSchema
