import * as VehicleService from '../services/vehicle.service'

export const getVehiclesController = async (req, res) => {
    try {
        const filters = {
            resident_id: req.query.resident_id,
            vehicle_type: req.query.vehicle_type,
            license_plate: req.query.license_plate
        }
        const data = await VehicleService.getVehicles(filters)
        return res.status(200).json({
            success: true,
            message: 'Get vehicles successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get vehicles failed',
            error: err.message
        })
    }
}

export const getVehicleByIdController = async (req, res) => {
    try {
        const data = await VehicleService.getVehicleById(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Get vehicle successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Get vehicle failed',
            error: err.message
        })
    }
}

export const createVehicleController = async (req, res) => {
    try {
        const data = req.body
        const createData = await VehicleService.createVehicle(data)
        return res.status(200).json({
            success: true,
            message: 'Create vehicle successfully',
            data: createData
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Create vehicle failed',
            error: err.message
        })
    }
}

export const updateVehicleController = async (req, res) => {
    try {
        const data = req.body
        const updateData = await VehicleService.updateVehicle(req.params.id, data)
        return res.status(200).json({
            success: true,
            message: 'Update vehicle successfully',
            data: updateData
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Update vehicle failed',
            error: err.message
        })
    }
}

export const updateVehicleStatusController = async (req, res) => {
    try {
        const { is_active } = req.body
        const data = await VehicleService.updateVehicleStatus(req.params.id, is_active)
        return res.status(200).json({
            success: true,
            message: 'Update vehicle status successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Update vehicle status failed',
            error: err.message
        })
    }
}

export const deleteVehicleController = async (req, res) => {
    try {
        const data = await VehicleService.deleteVehicle(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Delete vehicle successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Delete vehicle failed',
            error: err.message
        })
    }
}

export const getMyVehiclesController = async (req, res) => {
    try {
        const userId = req.currentUser?._id || req.currentUser?.id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const data = await VehicleService.getMyVehicles(userId)
        return res.status(200).json({
            success: true,
            message: 'Get my vehicles successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get my vehicles failed',
            error: err.message
        })
    }
}
