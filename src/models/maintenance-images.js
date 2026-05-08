import mongoose from 'mongoose'
import createModel from './base'

const MaintenanceImagesSchema = createModel(
    'MaintenanceImages',
    'maintenance_images',
    {
        request_id: { type: mongoose.Schema.ObjectId, ref: 'MaintenanceRequests', required: true },
        image_url: { type: String, default: '' },
        uploaded_at: { type: Date, default: Date.now, required: true }
    }
)

export default MaintenanceImagesSchema
