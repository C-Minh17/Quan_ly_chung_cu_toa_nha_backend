import * as BuildingService from '../services/building.service'

export const getBuildingController = async (req, res) => {
    try {
        const data = await BuildingService.getBuilding()
        return res.status(200).json({
            success: true,
            message: 'Get building successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get building failed',
            error: err.message
        })
    }
}

export const createBuildingController = async (req, res) => {
    try {
        const data = req.body
        const createData = await BuildingService.createBuilding(data)
        return res.status(200).json({
            success: true,
            message: 'Create building successfully',
            data: createData
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Create building failed',
            error: err.message
        })
    }
}
export const updateBuildingController = async (req, res) => {
    try {
        const data = req.body
        const updateData = await BuildingService.updateBuilding(req.params.id, data)
        return res.status(200).json({
            success: true,
            message: 'Update building successfully',
            data: updateData
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Update building failed',
            error: err.message
        })
    }
}
export const deleteBuildingController = async (req, res) => {
    try {
        const data = await BuildingService.deleteBuilding(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Delete building successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Delete building failed',
            error: err.message
        })
    }
}