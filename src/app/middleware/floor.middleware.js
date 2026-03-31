import { Floor } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkFloorId = async (req, res, next) => {
    try {
        const defaultId = req.params.id

        if (isValidObjectId(defaultId)) {
            const floor = await Floor.findById(defaultId)
            if (floor) {
                req.floor = floor
                next()
                return
            }
        }
        abort(404, 'Không tìm thấy data')
    } catch (err) {
        next(err)
    }
}