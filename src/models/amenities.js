import createModel from './base'

const amenitiesSchema = createModel(
    'Amenities',
    'amenities',
    {
        amenities_code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        id: { type: String, required: true, unique: true },
        description: { type: String, default: '' },
        capacity: { type: Number, default: 0 },
        open_time: { type: Date, default: Date.now },
        close_time: { type: Date, default: Date.now },
        is_active: { type: Boolean, default: true },
        created_at: {
            type: Date, required: true, default: Date.now
        }
    },
)

export default amenitiesSchema