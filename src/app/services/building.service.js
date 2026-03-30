import { Building } from '@/models'
import { abort } from '@/utils/helpers'

export const getBuilding = async () => {
    const res = await Building.find()
    if (!res) {
        abort(404, 'Building not found')
    }
    return res
}

export const createBuilding = async (data) => {
    const res = await Building.create(data)
    if (!res) {
        abort(404, 'Create building failed')
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
    const res = await Building.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'Delete building failed')
    }
    return res
}