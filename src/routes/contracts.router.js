import { Router } from 'express'
import * as ContractController from '@/app/controllers/contracts.controller'
import validate from '@/app/middleware/admin/validate'
import { createItem, updateItem } from '@/app/requests/contracts.request'
import { checkContractId } from '@/app/middleware/contracts.middleware'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

router.get('/', ContractController.getContractsController)
router.get('/me', asyncHandler(checkValidToken), ContractController.getMyContractsController)
router.post('/', validate(createItem), ContractController.createContractController)

router.get('/:id', checkContractId, ContractController.getContractByIdController)
router.put('/:id', checkContractId, validate(updateItem), ContractController.updateContractController)
router.patch('/:id/terminate', checkContractId, ContractController.terminateContractController)


export default router
