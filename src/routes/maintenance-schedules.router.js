import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'
import { checkMaintenanceSchedulesId } from '@/app/middleware/maintenance-schedules.middleware'
import { createItem, updateItem, completeItem } from '@/app/requests/maintenance-schedules.request'

import { getMaintenanceSchedulesController, postMaintenanceSchedulesController, getByIdMaintenanceSchedulesController, updateMaintenanceSchedulesController, deleteMaintenanceSchedulesController, completeMaintenanceSchedulesController } from '@/app/controllers/maintenance-schedules.controller'

const router = Router()

router.get('/', getMaintenanceSchedulesController)
router.post('/', validate(createItem), postMaintenanceSchedulesController)
router.get('/:id', checkMaintenanceSchedulesId, getByIdMaintenanceSchedulesController)
router.put('/:id', checkMaintenanceSchedulesId, validate(updateItem), updateMaintenanceSchedulesController)
router.patch('/:id/complete', checkMaintenanceSchedulesId, validate(completeItem), completeMaintenanceSchedulesController)
router.delete('/:id', checkMaintenanceSchedulesId, deleteMaintenanceSchedulesController)

export default router
