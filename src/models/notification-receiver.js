import mongoose from 'mongoose'
import createModel from './base'

const notificationReceiverSchema = createModel(
    'NotificationReceiver',
    'notification_receivers',
    {
        notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        read: { type: Boolean, default: false },
        readAt: { type: Date }
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: false }
    }
)

export default notificationReceiverSchema
