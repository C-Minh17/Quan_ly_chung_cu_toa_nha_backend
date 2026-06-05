import mongoose from 'mongoose'
import createModel from './base'

const userDeviceSchema = createModel(
    'UserDevice',
    'user_devices',
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        playerId: { type: String, required: true },
        deviceType: {
            type: String,
            enum: ['Web', 'Android', 'iOS'],
            default: 'Web'
        }
    },
    {
        timestamps: { createdAt: false, updatedAt: 'updatedAt' }
    }
)

export default userDeviceSchema
