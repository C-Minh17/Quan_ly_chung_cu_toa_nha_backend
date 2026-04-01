import { Resident } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkResidentId = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isValidObjectId(id)) {
            const resident = await Resident.findById(id)
            if (resident) {
                req.resident = resident
                next()
                return
            }
        }

        abort(404, 'Resident not found')
    } catch (err) {
        next(err)
    }
}
