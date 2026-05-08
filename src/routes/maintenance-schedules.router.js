import { Router } from 'express'
import { 
    getMaintenanceSchedulesController, 
    postMaintenanceSchedulesController, 
    getByIdMaintenanceSchedulesController, 
    updateMaintenanceSchedulesController, 
    deleteMaintenanceSchedulesController,
    completeMaintenanceSchedulesController
} from '@/app/controllers/maintenance-schedules.controller'

const router = Router()

router.get('/', getMaintenanceSchedulesController)
router.post('/', postMaintenanceSchedulesController)
router.get('/:id', getByIdMaintenanceSchedulesController)
router.put('/:id', updateMaintenanceSchedulesController)
router.patch('/:id/complete', completeMaintenanceSchedulesController)
router.delete('/:id', deleteMaintenanceSchedulesController)

export default router
