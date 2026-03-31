import { Router } from 'express'
import { checkFloorId } from '@/app/middleware/floor.middleware'
import { createItem } from '@/app/requests/floor.request'
import validate from '@/app/middleware/admin/validate'
import { createFloorController, getByIdFloorController, getFloorController } from '@/app/controllers/floor.controller'

const router = Router()

router.get('/', getFloorController)
router.post('/', validate(createItem), createFloorController)
router.get('/:id', checkFloorId, getByIdFloorController)

export default router