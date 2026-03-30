import { Router } from 'express'
import { createBuildingController, getBuildingController } from '@/app/controllers/building.controller'
import validate from '@/app/middleware/admin/validate'
import { createItem } from '@/app/requests/building.request'

const router = Router()

router.get('/', getBuildingController)
router.post('/', validate(createItem), createBuildingController)

export default router