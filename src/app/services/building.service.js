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