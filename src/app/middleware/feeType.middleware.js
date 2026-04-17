import { FeeTypes } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkFeeTypeId = async (req,res,next) => {
    const defaultId = req.params.id || req.params.MaJorId

    if(isValidObjectId(defaultId)){
        const feeType = await FeeTypes.findById(defaultId)
        if(feeType){
            req.feeType = feeType
            next()
            return
        }
    }
    abort(404, 'không tìm data')
}