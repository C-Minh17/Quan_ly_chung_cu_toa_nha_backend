import { Router } from 'express'
import { getResident, getResidentById, createResident, updateResident, deleteResident, getCurrentResident } from '@/app/controllers/residents.controller'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { asyncHandler } from '@/utils/helpers'
import validate from '@/app/middleware/admin/validate'
import { createItem, updateItem } from '@/app/requests/resident.request'
import { checkResidentId } from '@/app/middleware/resident.middleware'

const router = Router()

router.get('/', getResident)
router.get('/me', asyncHandler(checkValidToken), getCurrentResident)
router.post('/', validate(createItem), createResident)
router.get('/:id', checkResidentId, getResidentById)
router.put('/:id', checkResidentId, validate(updateItem), updateResident)
router.delete('/:id', checkResidentId, deleteResident)

export default router