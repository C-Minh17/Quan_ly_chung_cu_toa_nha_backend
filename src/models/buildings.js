import createModel from './base'

const buildingSchema = createModel(
    'Building',
    'buildings',
    {
        name: { type: String, required: true },
        id: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        total_floors: { type: Number, required: false, default: 0 },
        description: { type: String, required: false, default: '' },
        created_at: {
            type: Date, required: true, default: Date.now
        },
    }
)

export default buildingSchema