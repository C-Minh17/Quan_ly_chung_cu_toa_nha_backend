import { Amenities } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkAmenitiesId = async (req, res, next) => {
    try {
        const defaultId = req.params.id

        if (isValidObjectId(defaultId)) {
            const amenities = await Amenities.findById(defaultId)
            if (amenities) {
                req.amenities = amenities
                next()
                return
            }
        }
        abort(404, 'Không tìm thấy tiện ích')
    } catch (err) {
        next(err)
    }
}