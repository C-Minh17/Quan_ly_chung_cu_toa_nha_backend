import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'
import { checkAmenitiesId } from '@/app/middleware/amenities.middleware'
import { createItem, updateItem, updateStatusItem } from '@/app/requests/amenities.request'

import {
    getAmenities,
    createAmenities,
    getByIdAmenities,
    updateAmenities,
    updateStatusAmenities,
    deleteAmenities,
    getAmenitiesSchedule
} from '@/app/controllers/amenities.controller'

const router = Router()

router.get('/', getAmenities)
router.post('/', validate(createItem), createAmenities)
router.get('/:id', checkAmenitiesId, getByIdAmenities)
router.put('/:id', checkAmenitiesId, validate(updateItem), updateAmenities)
router.patch('/:id/status', checkAmenitiesId, validate(updateStatusItem), updateStatusAmenities)
router.delete('/:id', checkAmenitiesId, deleteAmenities)

// Lịch đặt chỗ (bạn có thể mở comment khi nào làm xong controller)
router.get('/:id/schedule', checkAmenitiesId, getAmenitiesSchedule)

export default router
