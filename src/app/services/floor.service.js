import { Floor, Building } from '@/models'
import { abort } from '@/utils/helpers'

export const getFloor = async () => {
    const res = await Floor.find().populate('building_id').lean()
    if (!res) {
        abort(404, 'Floor not found')
    }
    res.building = res.building_id
    delete res.building_id
    return res
}

export const createFloor = async (data) => {
    if (!data.building_id) {
        abort(400, 'chuyền building_id vào')
    }
    const buildingExists = await Building.findById(data.building_id)
    if (!buildingExists) {
        abort(404, 'building_id not found')
    }
    const res = await Floor.create(data)
    if (!res) {
        abort(400, 'Create floor failed')
    }

    const populated = await Floor.findById(res._id).populate('building_id').lean()
    populated.building = populated.building_id
    delete populated.building_id

    return populated
}

export const getByIdFloor = async (id) => {
    const res = await Floor.findById(id).populate('building_id').lean()
    if (!res) {
        abort(404, 'Floor not found')
    }

    res.building = res.building_id
    delete res.building_id

    return res
}

export const updateFloor = async (id, data) => {
    const res = await Floor.findByIdAndUpdate(id, data, { new: true })
        .populate('building_id')
    if (!res) {
        abort(404, 'Floor not found')
    }

    res.building = res.building_id
    delete res.building_id

    return res
}

export const deleteFloor = async (id) => {
    const res = await Floor.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'Floor not found')
    }
    return res
}
