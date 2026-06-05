import createModel from './base'

const notificationSchema = createModel(
    'Notification',
    'notifications',
    {
        title: { type: String, required: true, maxlength: 250 },
        description: { type: String, maxlength: 500 },
        content: { type: String },
        senderName: { type: String, default: 'Hệ thống' },
        type: {
            type: String,
            enum: ['OneSignalService', 'Email', 'All'],
            default: 'OneSignalService'
        },
        sourceType: {
            type: String,
            enum: ['SLINK', 'PORTAL', 'TC', 'CSVC', 'NOTIFICATION'],
            default: 'NOTIFICATION'
        },
        notificationInternal: { type: Boolean, default: false },
        imageUrl: { type: String },
        taiLieuDinhKem: [{ type: String }],
        thoiGianHieuLuc: { type: Date },
        dataPartitionCode: { type: String }
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

export default notificationSchema
