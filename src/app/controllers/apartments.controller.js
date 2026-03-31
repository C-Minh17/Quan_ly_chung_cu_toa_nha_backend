import * as apartmentService from '@/app/services/apartments.service'

export const getApartmentController = async (req, res) => {
    try {
        const data = await apartmentService.getApartment()
        return res.status(200).json({
            success: true,
            message: 'Get apartment successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get apartment failed',
            error: err.message
        })
    }
}

export const createApartmentController = async (req, res) => {
    try {
        const data = req.body
        const createData = await apartmentService.createApartment(data)
        return res.status(200).json({
            success: true,
            message: 'Create apartment successfully',
            data: createData
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Create apartment failed',
            error: err.message
        })
    }
}

export const getByIdApartmentController = async (req, res) => {
    try {
        const data = await apartmentService.getByIdApartment(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Get apartment successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get apartment failed',
            error: err.message
        })
    }
}

export const updateApartmentController = async (req, res) => {
    try {
        const data = req.body
        const updateData = await apartmentService.updateApartment(req.params.id, data)
        return res.status(200).json({
            success: true,
            message: 'Update apartment successfully',
            data: updateData
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Update apartment failed',
            error: err.message
        })
    }
}

export const deleteApartmentController = async (req, res) => {
    try {
        const data = await apartmentService.deleteApartment(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Delete apartment successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Delete apartment failed',
            error: err.message
        })
    }
}

export const updateStatusApartmentController = async (req, res) => {
    try {
        const { status } = req.body
        const updateData = await apartmentService.updateStatusApartment(req.params.id, status)
        return res.status(200).json({
            success: true,
            message: 'Update apartment status successfully',
            data: updateData
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Update apartment status failed',
            error: err.message
        })
    }
}