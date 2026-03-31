import { Apartment } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkApartmentId = async (req, res, next) => {
    try {
        const defaultId = req.params.id

        if (isValidObjectId(defaultId)) {
            const apartment = await Apartment.findById(defaultId)
            if (apartment) {
                req.apartment = apartment
                next()
                return
            }
        }
        abort(404, 'Không tìm thấy căn hộ')
    } catch (err) {
        next(err)
    }
}