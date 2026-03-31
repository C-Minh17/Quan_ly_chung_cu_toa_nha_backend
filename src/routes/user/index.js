import { Router } from 'express'
import { asyncHandler } from '@/utils/helpers'
import { checkValidToken } from '@/app/middleware/user/auth.middleware'
import { checkUserRole } from '@/app/middleware/user/role.middleware'
import authRouter from './auth.router'
import profileRouter from './profile.route'
import validate from '@/app/middleware/user/validate'
import * as userRequest from '@/app/requests/user/user.request'
import * as userController from '@/app/controllers/user/user.controller'

const user = Router()
const checkAdminOrManager = checkUserRole('SUPER_ADMIN', 'MANAGER')

user.get('/', asyncHandler(checkValidToken), asyncHandler(checkAdminOrManager), asyncHandler(userController.getAllUsers))
user.post('/', asyncHandler(checkValidToken), asyncHandler(checkAdminOrManager), asyncHandler(validate(userRequest.createUser)), asyncHandler(userController.createUser))
user.patch('/password', asyncHandler(checkValidToken), asyncHandler(checkAdminOrManager), asyncHandler(validate(userRequest.changePassword)), asyncHandler(userController.changePassword))
user.patch('/:id/password', asyncHandler(checkValidToken), asyncHandler(checkAdminOrManager), asyncHandler(validate(userRequest.changePassword)), asyncHandler(userController.changePassword))
user.get('/:id', asyncHandler(checkValidToken), asyncHandler(checkAdminOrManager), asyncHandler(userController.getUserById))
user.put('/:id', asyncHandler(checkValidToken), asyncHandler(checkAdminOrManager), asyncHandler(validate(userRequest.updateUser)), asyncHandler(userController.updateUser))
user.delete('/:id', asyncHandler(checkValidToken), asyncHandler(checkAdminOrManager), asyncHandler(userController.deleteUser))
user.use('/auth', authRouter)
user.use('/profile', profileRouter)

export default user
