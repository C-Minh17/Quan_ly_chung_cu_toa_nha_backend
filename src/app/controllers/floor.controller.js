import * as floorService from '@/app/services/floor.service'

export const getFloorController = async (req, res) => {
    try {
        const data = await floorService.getFloor()
        return res.status(200).json({
            success: true,
            message: 'Get floor successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get floor failed',
            error: err.message
        })
    }
}

export const createFloorController = async (req, res) => {
    try {
        const data = req.body
        const createData = await floorService.createFloor(data)
        return res.status(200).json({
            success: true,
            message: 'Create floor successfully',
            data: createData
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Create floor failed',
            error: err.message
        })
    }
}

export const getByIdFloorController = async (req, res) => {
    try {
        const data = await floorService.getByIdFloor(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Get floor successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get floor failed',
            error: err.message
        })
    }
}