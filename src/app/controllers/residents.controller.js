import * as ResidentService from '../services/resident.service'

export const getResident = async (req,res) => {
    try{
        const data = await ResidentService.getResident()
        return res.status(200).json({
            success: true,
            message: 'Get resident successfully',
            data: data
        })  
    } catch (error) {   
        return res.status(500).json({
            success: false,
            message: 'Get resident failed', 
            data: error.message
        })
    }
}

export const getResidentById = async (req,res) => {
    try{
        const data = await ResidentService.getResidentById(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Get resident successfully',
            data: data
        })  
    } catch (error) {   
        return res.status(500).json({
            success: false,
            message: 'Get resident failed', 
            data: error.message
        })
    }
}

export const createResident = async (req,res) => {
    try{
        const data = req.body 
        const createData = await ResidentService.createResident(data)
        return res.status(200).json({
            success: true,
            message: 'Create resident successfully',
            data: createData
        })  
    } catch (error) {   
        return res.status(500).json({
            success: false,
            message: 'Create resident failed', 
            data: error.message
        })
    }
}

export const updateResident = async (req,res) => {
    try{
        const data = req.body
        const updateData = await ResidentService.updateResident(req.params.id, data)
        return res.status(200).json({
            success: true,
            message: 'Update resident successfully',
            data: updateData
        })  
    } catch (error) {   
        return res.status(500).json({
            success: false,
            message: 'Update resident failed', 
            data: error.message
        })
    }
}

export const deleteResident = async (req,res) => {
    try{
        const data = await ResidentService.deleteResident(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Delete resident successfully',
            data: data
        })  
    } catch (error) {   
        return res.status(500).json({
            success: false,
            message: 'Delete resident failed', 
            data: error.message
        })
    }
}

