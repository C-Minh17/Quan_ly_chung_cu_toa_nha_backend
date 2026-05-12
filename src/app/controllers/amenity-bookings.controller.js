import * as amenityBookingsService from '@/app/services/amenity-bookings.service'

export const getAllAmenityBookingsController = async (req, res) => {
    try {
        const data = await amenityBookingsService.getAllAmenityBookings()
        return res.status(200).json({
            success: true,
            message: 'Get amenity bookings successfully',
            data: data
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Get amenity bookings failed',
            error: error.message
        })
    }
}

export const getMyAmenityBookingsController = async (req, res) => {
    try {
        const data = await amenityBookingsService.getMyAmenityBookings(req.currentUser._id)
        return res.status(200).json({
            success: true,
            message: 'Get my amenity bookings successfully',
            data: data
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Get my amenity bookings failed',
            error: error.message
        })
    }
}

export const getByIdAmenityBookingsController = async (req, res) => {
    try {
        const data = await amenityBookingsService.getByIdAmenityBookings(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Get amenity booking successfully',
            data: data
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Get amenity booking failed',
            error: error.message
        })
    }
}

export const createAmenityBookingsController = async (req, res) => {
    try {
        const data = req.body
        const createData = await amenityBookingsService.createAmenityBookings(data)
        return res.status(200).json({
            success: true,
            message: 'Create amenity booking successfully',
            data: createData
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Create amenity booking failed',
            error: error.message
        })
    }
}

export const approveAmenityBookingsController = async (req, res) => {
    try {
        const updateData = await amenityBookingsService.updateApproveAmenityBookings({ id: req.params.id })
        return res.status(200).json({
            success: true,
            message: 'Approve amenity booking successfully',
            data: updateData
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Approve amenity booking failed',
            error: error.message
        })
    }
}

export const rejectAmenityBookingsController = async (req, res) => {
    try {
        const updateData = await amenityBookingsService.updateRejectAmenityBookings({ id: req.params.id })
        return res.status(200).json({
            success: true,
            message: 'Reject amenity booking successfully',
            data: updateData
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Reject amenity booking failed',
            error: error.message
        })
    }
}

export const deleteAmenityBookingsController = async (req, res) => {
    try {
        const data = await amenityBookingsService.deleteAmenityBookings(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Delete amenity booking successfully',
            data: data
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Delete amenity booking failed',
            error: error.message
        })
    }
}
