import { createUtilityReading, deleteUtilityReading, getUtilityReading, getUtilityReadingById, updateUtilityReading } from '@/app/controllers/utilityReading.controller'
import validate from '@/app/middleware/admin/validate'
import { checkUtilityReadingId } from '@/app/middleware/utilityReading.middleware'
import { Router } from 'express'
import { createItem, updateItem } from '@/app/requests/utilityReading.request'

const router = Router()

router.get('/',getUtilityReading)
router.get('/:id',checkUtilityReadingId,getUtilityReadingById)
router.post('/',validate(createItem),createUtilityReading)
router.put('/:id',checkUtilityReadingId,validate(updateItem),updateUtilityReading)
router.delete('/:id',checkUtilityReadingId,deleteUtilityReading)

export default router