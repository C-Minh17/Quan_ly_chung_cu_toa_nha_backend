import * as UtilityReading from '../services/utilityReading.service'

export const getUtilityReading = async (req,res) => {
    try{
        const data = await UtilityReading.getUtilityReading()
        return res.status(200).json({
            success:true,
            message:'lấy data thành công',
            data:data
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'lỗi lấy data',
            data:error.message
        })
    }
}

export const getUtilityReadingById = async (req,res) => {
    try{
        const data = await UtilityReading.getUtilityReadingById(req.params.id)
        return res.status(200).json({
            success:true,
            message:'lấy data thành công',
            data:data
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'lỗi lấy data',
            data:error.message
        })
    }
}

export const createUtilityReading = async (req,res) => {
    try{
        const data = await UtilityReading.createUtilityReading(req.body)
        return res.status(200).json({
            success:true,
            message:'Tạo data thành công',
            data:data
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'lỗi tạo data',
            data:error.message
        })
    }
}

export const updateUtilityReading = async (req,res) => {
    try{
        const data = await UtilityReading.updateUtilityReading(req.params.id,req.body)
        return res.status(200).json({
            success:true,
            message:'Tạo data thành công',  
            data:data
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'lỗi tạo data',
            data:error.message
        })
    }
} 

export const deleteUtilityReading = async (req,res) => {
    try{
        const data = await UtilityReading.deleteUtilityReading(req.params.id)
        return res.status(200).json({
            success:true,
            message:'xóa data thành công',
            data:data
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'lỗi xóa data',
            data:error.message
        })
    }
} 