import { Vehicle } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'


export const checkVehicleId = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isValidObjectId(id)) {
            const vehicle = await Vehicle.findOne({ _id: id, deleted: false })
            if (vehicle) {
                req.vehicle = vehicle
                next()
                return
            }
        }

        abort(404, 'Vehicle not found')
    } catch (err) {
        next(err)
    }
}
