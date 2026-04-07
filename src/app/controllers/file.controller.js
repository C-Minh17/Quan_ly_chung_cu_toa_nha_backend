import * as fileService from '@/app/services/file.service'

export async function uploadFile(req, res) {
    const { file, scope } = req.body

    const result = await fileService.uploadFile(file, scope)

    res.status(200).json({
        statusCode: 200,
        message: 'Upload thành công',
        data: result
    })
}

export async function getFileInfo(req, res) {
    const { id } = req.params

    const result = await fileService.getFileInfo(id)

    res.status(200).json({
        statusCode: 200,
        message: 'Lấy thông tin file thành công',
        data: result
    })
}
