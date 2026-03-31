import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'
import { createItem, updateItem, updateStatusItem } from '@/app/requests/apartments.request'
import { checkApartmentId } from '@/app/middleware/apartments.middleware'
import { getApartmentController, createApartmentController, getByIdApartmentController, updateApartmentController, deleteApartmentController, updateStatusApartmentController } from '@/app/controllers/apartments.controller'

const router = Router()

router.get('/', getApartmentController)
router.post('/', validate(createItem), createApartmentController)
router.get('/:id', checkApartmentId, getByIdApartmentController)
router.put('/:id', checkApartmentId, validate(updateItem), updateApartmentController)
router.patch('/:id/status', checkApartmentId, validate(updateStatusItem), updateStatusApartmentController)
router.delete('/:id', checkApartmentId, deleteApartmentController)

export default router