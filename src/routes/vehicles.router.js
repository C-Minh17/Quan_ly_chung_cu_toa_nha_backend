import { Router } from 'express'
import * as VehicleController from '@/app/controllers/vehicles.controller'
import validate from '@/app/middleware/admin/validate'
import { createItem, updateItem } from '@/app/requests/vehicle.request'
import { checkVehicleId } from '@/app/middleware/vehicle.middleware'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'

const router = Router()

router.get('/me', asyncHandler(checkValidToken), VehicleController.getMyVehiclesController)

router.get('/', VehicleController.getVehiclesController)
router.get('/:id', checkVehicleId, VehicleController.getVehicleByIdController)
router.post('/', validate(createItem), VehicleController.createVehicleController)
router.put('/:id', checkVehicleId, validate(updateItem), VehicleController.updateVehicleController)
router.patch('/:id/status', checkVehicleId, VehicleController.updateVehicleStatusController)
router.delete('/:id', checkVehicleId, VehicleController.deleteVehicleController)

export default router
