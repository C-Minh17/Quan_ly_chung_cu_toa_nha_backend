import { Router } from 'express'
import { getResident, getResidentById, createResident, updateResident, deleteResident } from '@/app/controllers/residents.controller'
import validate from '@/app/middleware/admin/validate'
import { createItem, updateItem } from '@/app/requests/resident.request'
import { checkResidentId } from '@/app/middleware/resident.middleware'

const router = Router()

router.get('/', getResident)
router.post('/', validate(createItem), createResident)
router.get('/:id', checkResidentId, getResidentById)
router.put('/:id', checkResidentId, validate(updateItem), updateResident)
router.delete('/:id', checkResidentId, deleteResident)

export default router