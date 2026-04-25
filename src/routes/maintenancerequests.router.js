import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'
import { checkMaintenanceRequestsId } from '@/app/middleware/maintenance-requests.middleware'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { createItem, updateItem, assignItem, updateStatusItem, closeItem, rateItem } from '@/app/requests/maintenance-requests.request'

import { getMaintenanceRequestsController, createMaintenanceRequestsController, getByIdMaintenanceRequestsController, updateMaintenanceRequestsController, assignMaintenanceRequestsController, updateStatusMaintenanceRequestsController, closeMaintenanceRequestsController, rateMaintenanceRequestsController, getMyMaintenanceRequestsController, getMaintenanceStatsController } from '@/app/controllers/maintenance-requests.controller'

const router = Router()

router.get('/', getMaintenanceRequestsController)
router.get('/stats', getMaintenanceStatsController)
router.get('/me', checkValidToken, getMyMaintenanceRequestsController)
router.post('/', validate(createItem), createMaintenanceRequestsController)
router.get('/:id', checkMaintenanceRequestsId, getByIdMaintenanceRequestsController)
router.put('/:id', checkMaintenanceRequestsId, validate(updateItem), updateMaintenanceRequestsController)
router.patch('/:id/assign', checkMaintenanceRequestsId, validate(assignItem), assignMaintenanceRequestsController)
router.patch('/:id/status', checkMaintenanceRequestsId, validate(updateStatusItem), updateStatusMaintenanceRequestsController)
router.patch('/:id/close', checkMaintenanceRequestsId, validate(closeItem), closeMaintenanceRequestsController)
router.post('/:id/rate', checkMaintenanceRequestsId, validate(rateItem), rateMaintenanceRequestsController)

export default router