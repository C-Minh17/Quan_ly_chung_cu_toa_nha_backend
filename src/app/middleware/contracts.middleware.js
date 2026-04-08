import { Contract } from '@/models'
import { abort } from '@/utils/helpers'
import { isValidObjectId } from 'mongoose'

export const checkContractId = async (req, res, next) => {
    const id = req.params.id

    if (isValidObjectId(id)) {
        const contract = await Contract.findById(id)
        if (contract) {
            req.contract = contract
            next()
            return
        }
    }
    abort(404, 'Không tìm thấy hợp đồng')
}
