import { Router } from 'express'
import { checkFloorId } from '@/app/middleware/floor.middleware'
import { createItem, updateItem } from '@/app/requests/floor.request'
import validate from '@/app/middleware/admin/validate'
import { createFloorController, getByIdFloorController, getFloorController, updateFloorController, deleteFloorController, getLayoutFloorController } from '@/app/controllers/floor.controller'

const router = Router()

router.get('/', getFloorController)
router.post('/', validate(createItem), createFloorController)
router.get('/:id', checkFloorId, getByIdFloorController)
router.get('/:id/layout', checkFloorId, getLayoutFloorController)
router.put('/:id', checkFloorId, validate(updateItem), updateFloorController)
router.delete('/:id', checkFloorId, deleteFloorController)

export default router