import express from 'express'
import * as fileController from '@/app/controllers/file.controller'

const router = express.Router()

router.post('/', fileController.uploadFile)
router.get('/:id/info', fileController.getFileInfo)

export default router
