import { UtilityReading } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkUtilityReadingId = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isValidObjectId(id)) {
            const utilityReading = await UtilityReading.findById(id)
            if (utilityReading) {
                req.utilityReading = utilityReading
                next()
                return
            }
        }

        abort(404, 'utilityReading not found')
    } catch (err) {
        next(err)
    }
}
