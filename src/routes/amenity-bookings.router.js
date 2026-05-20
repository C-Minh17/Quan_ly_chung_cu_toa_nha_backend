import { Router } from 'express'
import validate from '@/app/middleware/admin/validate'
import { checkAmenityBookingId } from '@/app/middleware/amenity-bookings.middleware'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { createItem } from '@/app/requests/amenity-bookings.request'

import {
    getAllAmenityBookingsController, getMyAmenityBookingsController, getByIdAmenityBookingsController, createAmenityBookingsController, approveAmenityBookingsController, rejectAmenityBookingsController, deleteAmenityBookingsController
} from '@/app/controllers/amenity-bookings.controller'

const router = Router()

router.get('/', getAllAmenityBookingsController)
router.get('/me', checkValidToken, getMyAmenityBookingsController)
router.post('/', validate(createItem), createAmenityBookingsController)
router.get('/:id', checkAmenityBookingId, getByIdAmenityBookingsController)
router.patch('/:id/approve', checkAmenityBookingId, approveAmenityBookingsController)
router.patch('/:id/reject', checkAmenityBookingId, rejectAmenityBookingsController)
router.delete('/:id', checkAmenityBookingId, deleteAmenityBookingsController)

export default router
