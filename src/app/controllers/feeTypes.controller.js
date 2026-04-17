import * as FeeTypeService from '../services/feeTypes.service'

export const getFeeTypeController = async (req,res) => {
    try {
        const data = await FeeTypeService.getFeeTypes()
        return res.status(200).json({
            success:true,
            message: 'Get feeTypes successfully',
            data:data
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message: 'Get feeTypes failed',
            error:err.message
        })
    }
}

export const createFeeTypeController = async (req,res) => {
    try {
        const data = await FeeTypeService.createFeeType(req.body)
        return res.status(200).json({
            success:true,
            message: 'Create feeTypes successfully',
            data:data
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message: 'Create feeTypes failed',
            error:err.message
        })
    }
}

export const getByIdFeeTypeController = async (req,res) => {
    try {
        const data = await FeeTypeService.getByIdFeeType(req.params.id)
        return res.status(200).json({
            success:true,
            message: 'Get feeTypes successfully',
            data:data
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message: 'Get feeTypes failed',
            error:err.message
        })
    }
}

export const updateFeeTypeController = async (req,res) => {
    try {
        const data = await FeeTypeService.updateFeetype(req.body ,req.params.id)
        return res.status(200).json({
            success:true,
            message: 'Update feeTypes successfully',
            data:data
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message: 'Update feeTypes failed',
            error:err.message
        })
    }
}

export const deleteFeeTypeController = async (req,res) => {
    try {
        const data = await FeeTypeService.deleteFeeType(req.params.id)
        return res.status(200).json({
            success:true,
            message: 'Delete feeTypes successfully',
            data:data
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message: 'Delete feeTypes failed',
            error:err.message
        })
    }
}

export const updateActiveFeeTypeController = async (req,res) => {
    try {
        const data = await FeeTypeService.updateFeetypeActive(req.params.id)
        return res.status(200).json({
            success:true,
            message: 'Delete feeTypes successfully',
            data:data
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message: 'Delete feeTypes failed',
            error:err.message
        })
    }
}