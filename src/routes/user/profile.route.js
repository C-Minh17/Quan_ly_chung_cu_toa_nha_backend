import express from 'express'
import * as profileController from '@/app/controllers/user/profile.controller'
import validate from '@/app/middleware/user/validate'
import * as profileRequest from '@/app/requests/user/profile.request'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'

const router = express.Router()

router.get('/me', checkValidToken, profileController.getProfile)
router.put('/me', [
    checkValidToken,
    validate(profileRequest.updateProfile)
], profileController.updateProfile)

export default router 