import { Router } from 'express'
import * as FeeTypeController from '@/app/controllers/feeTypes.controller'
import validate from '@/app/middleware/admin/validate'
import { createItem , updateItem } from '@/app/requests/feeType.request'
import { checkFeeTypeId } from '@/app/middleware/feeType.middleware'

const router = Router()

router.get('/', FeeTypeController.getFeeTypeController)
router.get('/:id',checkFeeTypeId , FeeTypeController.getByIdFeeTypeController)
router.post('/',validate(createItem) , FeeTypeController.createFeeTypeController)
router.put('/:id',checkFeeTypeId,validate(updateItem) , FeeTypeController.updateFeeTypeController) 
router.delete('/:id',checkFeeTypeId , FeeTypeController.deleteFeeTypeController)
router.put('/:id/active', checkFeeTypeId , FeeTypeController.updateActiveFeeTypeController)


export default router
