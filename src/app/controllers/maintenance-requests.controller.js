import * as maintenaceRequestsService from '@/app/services/maintenance-requests.service'

export const getMaintenanceRequestsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.getMaintenance_requests()
        return res.status(200).json({
            success: true,
            message: 'Get successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Get maintenace_request failed',
            error: err.message
        })
    }
}
export const createMaintenanceRequestsController = async (req, res) => {
    try {
        const data = req.body
        const Createdata = await maintenaceRequestsService.createMaintenance_requests(data)
        return res.status(200).json({
            success: true,
            message: 'Create successfully',
            data: Createdata
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Create failed',
            error: err.message
        })
    }
}

export const getByIdMaintenanceRequestsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.getByIdMaintenance_requests(req.params.id)
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

export const updateMaintenanceRequestsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.updateMaintenance_requests(req.params.id, req.body)
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

export const assignMaintenanceRequestsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.assignMaintenance_requests(req.params.id, req.body)
        return res.status(200).json({
            success: true,
            message: 'Assigned successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Assign failed',
            error: err.message
        })
    }
}

export const updateStatusMaintenanceRequestsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.updateStatusMaintenance_requests(req.params.id, req.body)
        return res.status(200).json({
            success: true,
            message: 'Update status successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Update status failed',
            error: err.message
        })
    }
}

export const closeMaintenanceRequestsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.closeMaintenance_requests(req.params.id, req.body)
        return res.status(200).json({
            success: true,
            message: 'Close ticket successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Close ticket failed',
            error: err.message
        })
    }
}

export const rateMaintenanceRequestsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.rateMaintenance_requests(req.params.id, req.body)
        return res.status(200).json({
            success: true,
            message: 'Rating successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Rating failed',
            error: err.message
        })
    }
}

export const getMyMaintenanceRequestsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.getMyMaintenance_requests(req.currentUser._id)
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

export const getMaintenanceStatsController = async (req, res) => {
    try {
        const data = await maintenaceRequestsService.getMaintenanceStats(req.query)
        return res.status(200).json({
            success: true,
            message: 'Get stats successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Get stats failed',
            error: err.message
        })
    }
}