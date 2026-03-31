import { Router } from 'express'
import { createBuildingController, getBuildingController, getByIdBuildingController, updateBuildingController, deleteBuildingController } from '@/app/controllers/building.controller'
import validate from '@/app/middleware/admin/validate'
import { createItem } from '@/app/requests/building.request'

const router = Router()

router.get('/', getBuildingController)
router.post('/', validate(createItem), createBuildingController)
router.get('/:id', getByIdBuildingController)
router.put('/:id', validate(createItem), updateBuildingController)
router.delete('/:id', deleteBuildingController)

export default router