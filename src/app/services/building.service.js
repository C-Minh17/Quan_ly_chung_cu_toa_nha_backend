import { Building, Floor, Apartment } from '@/models'
import { abort } from '@/utils/helpers'

export const getBuilding = async () => {
    const res = await Building.find()
    if (!res) {
        abort(404, 'Building not found')
    }
    return res
}

export const createBuilding = async (data) => {
    const lastBuilding = await Building.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
    const nextId = lastBuilding && lastBuilding.id ? (parseInt(lastBuilding.id) + 1).toString().padStart(3, '0') : '001'
    data.id = nextId

    const res = await Building.create(data)
    if (!res) {
        abort(404, 'Create building failed')
    }
    return res
}

export const getByIdBuilding = async (id) => {
    const res = await Building.findById(id)
    if (!res) {
        abort(404, 'Building not found')
    }
    return res
}

export const updateBuilding = async (id, data) => {
    const res = await Building.findByIdAndUpdate(id, data, { new: true })
    if (!res) {
        abort(404, 'Update building failed')
    }
    return res
}

export const deleteBuilding = async (id) => {
    const floors = await Floor.find({ building_id: id }).select('_id')
    const floorIds = floors.map(f => f._id)
    await Apartment.deleteMany({ floor_id: { $in: floorIds } })
    await Floor.deleteMany({ building_id: id })
    const res = await Building.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'Delete building failed')
    }
    return res
}