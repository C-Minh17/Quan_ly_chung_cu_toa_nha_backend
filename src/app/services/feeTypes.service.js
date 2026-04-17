import { FeeTypes } from '@/models'
import { abort } from '@/utils/helpers'

export const getFeeTypes = async () => {
    const res = await FeeTypes.find()
    if(!res){
        abort(404,'Feetype not found')
    }
    return res
}

export const createFeeType = async (data) => {
    const res = await FeeTypes.create(data)
    if (!res) {
        abort(404, 'Create feetype failed')
    }
    return res
}

export const getByIdFeeType = async (id) => {
    const res = await FeeTypes.findById(id)
    if (!res) {
        abort(404, 'Feetype not found')
    }
    return res
}

export const updateFeetype = async (data,id) => {
    const res = await FeeTypes.findByIdAndUpdate(id ,data ,{new:true})
    if (!res) {
        abort(404, 'Feetype not found')
    }
    return res
}

export const deleteFeeType = async (id) => {
    const res = await FeeTypes.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'Feetype not found')
    }
    return res
}

export const updateFeetypeActive = async (id) => {
    const feetype = await FeeTypes.findOne(id)
    if (!feetype) {
        abort(404, 'Feetype not found')
    }

    const res = await FeeTypes.findByIdAndUpdate(id,{is_active:!feetype.is_active},{new:true})

    return res
}