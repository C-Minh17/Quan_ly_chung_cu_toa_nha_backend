import { MaintenanceRequests } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkMaintenanceRequestsId = async (req, res, next) => {
    try {
        const defaultId = req.params.id

        if (isValidObjectId(defaultId)) {
            const maintenanceRequests = await MaintenanceRequests.findById(defaultId)
            if (maintenanceRequests) {
                req.maintenanceRequests = maintenanceRequests
                next()
                return
            }
        }
        abort(404, 'Không tìm thấy yêu cầu bảo trì')
    } catch (err) {
        next(err)
    }
}