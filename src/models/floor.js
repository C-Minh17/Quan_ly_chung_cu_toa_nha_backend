import mongoose from 'mongoose'
import createModel from './base'

const floorSchema = createModel(
    'Floor',
    'floors',
    {
        name: { type: String, required: true },
        floor_number: { type: Number, required: true },
        building_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
        description: { type: String, required: false, default: '' },
    }
)

export default floorSchema