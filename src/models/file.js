import createModel from './base'

const File = createModel(
    'File',
    'files',
    {
        filename: {
            type: String,
            required: true
        },
        originalname: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        scope: {
            type: String,
            enum: ['Public', 'Internal', 'Private'],
            default: 'Public'
        },
        deleted: {
            type: Boolean,
            default: false
        }
    }
)

export default File
