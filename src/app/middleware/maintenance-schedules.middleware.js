import { MaintenanceSchedules } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkMaintenanceSchedulesId = async (req, res, next) => {
    try {
        const defaultId = req.params.id

        if (isValidObjectId(defaultId)) {
            const schedule = await MaintenanceSchedules.findById(defaultId)
            if (schedule) {
                req.maintenanceSchedule = schedule
                next()
                return
            }
        }
        abort(404, 'Không tìm thấy lịch bảo trì')
    } catch (err) {
        next(err)
    }
}
