import { AmenityBooking } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkAmenityBookingId = async (req, res, next) => {
    try {
        const defaultId = req.params.id

        if (isValidObjectId(defaultId)) {
            const amenityBooking = await AmenityBooking.findById(defaultId)
            if (amenityBooking) {
                req.amenityBooking = amenityBooking
                next()
                return
            }
        }
        abort(404, 'Không tìm thấy thông tin đặt tiện ích')
    } catch (err) {
        next(err)
    }
}
