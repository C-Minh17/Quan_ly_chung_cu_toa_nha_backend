import * as maintenanceSchedulesService from '@/app/services/maintenance-schedules.service'

export const getMaintenanceSchedulesController = async (req, res) => {
    try {
        const data = await maintenanceSchedulesService.getMaintenance_schedules()
        return res.status(200).json({
            success: true,
            message: 'Get successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Get maintenance_schedules failed',
            error: err.message
        })
    }
}

export const postMaintenanceSchedulesController = async (req, res) => {
    try {
        const data = await maintenanceSchedulesService.postMaintenance_schedules(req.body)
        return res.status(200).json({
            success: true,
            message: 'Create successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Create failed',
            error: err.message
        })
    }
}

export const getByIdMaintenanceSchedulesController = async (req, res) => {
    try {
        const data = await maintenanceSchedulesService.getByIdMaintenance_schedules(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Get successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Get failed',
            error: err.message
        })
    }
}

export const updateMaintenanceSchedulesController = async (req, res) => {
    try {
        const data = await maintenanceSchedulesService.updateMaintenance_schedules(req.params.id, req.body)
        return res.status(200).json({
            success: true,
            message: 'Update successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Update failed',
            error: err.message
        })
    }
}

export const deleteMaintenanceSchedulesController = async (req, res) => {
    try {
        const data = await maintenanceSchedulesService.deleteMaintenance_schedules(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Delete successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Delete failed',
            error: err.message
        })
    }
}

export const completeMaintenanceSchedulesController = async (req, res) => {
    try {
        const data = await maintenanceSchedulesService.completeMaintenance_schedules(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Complete schedule successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Complete schedule failed',
            error: err.message
        })
    }
}
