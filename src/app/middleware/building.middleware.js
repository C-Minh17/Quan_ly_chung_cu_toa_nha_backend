import { Building } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkBuildingId = async (req, res, next) => {
    const defaultId = req.params.id || req.params.MajorId

    if (isValidObjectId(defaultId)) {
        const building = await Building.findById(defaultId)
        if (building) {
            req.building = building
            next()
            return
        }
    }
    abort(404, 'không tìm data')
}