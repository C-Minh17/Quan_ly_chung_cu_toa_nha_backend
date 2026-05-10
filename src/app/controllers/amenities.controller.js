import * as amenitiesService from '@/app/services/amenities.service'


export const getAmenities = async (req, res) => {
    try {
        const data = await amenitiesService.getAmenities()
        return res.status(200).json({
            success: true,
            message: 'Get amenities successfully',
            data: data
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Get amenities failed',
            error: error.message
        })
    }
}

export const getByIdAmenities = async (req, res) => {
    try {
        const data = await amenitiesService.getByIdAmenities(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Get amenities successfully',
            data: data
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Get amenities failed',
            error: error.message
        })
    }
}

export const createAmenities = async (req, res) => {
    try {
        const data = req.body
        const createData = await amenitiesService.createAmenities(data)
        return res.status(200).json({
            success: true,
            message: 'Create amenities successfully',
            data: createData
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Create amenities failed',
            error: error.message
        })
    }
}

export const updateAmenities = async (req, res) => {
    try {
        const data = req.body
        const updateData = await amenitiesService.updateAmenities(req.params.id, data)
        return res.status(200).json({
            success: true,
            message: 'Update amenities successfully',
            data: updateData
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Update amenities failed',
            error: error.message
        })
    }
}

export const updateStatusAmenities = async (req, res) => {
    try {
        const data = req.body
        const updateData = await amenitiesService.updateStatusAmenities(req.params.id, data.is_active)
        return res.status(200).json({
            success: true,
            message: 'Update amenities status successfully',
            data: updateData
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Update amenities status failed',
            error: error.message
        })
    }
}

export const deleteAmenities = async (req, res) => {
    try {
        const data = await amenitiesService.deleteAmenities(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Delete amenities successfully',
            data: data
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Delete amenities failed',
            error: error.message
        })
    }
}   