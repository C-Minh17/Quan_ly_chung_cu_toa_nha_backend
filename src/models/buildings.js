import createModel from './base'

const buildingSchema = createModel(
    'Building',
    'buildings',
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        total_floors: { type: Number, required: true },
        description: { type: String, required: false, default: '' },
        created_at: {
            type: Date, required: true, default: Date.now
        },
    }
)

export default buildingSchema