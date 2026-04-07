import { File } from '@/models'
import { LINK_STATIC_URL } from '@/configs'
import { abort } from '@/utils/helpers'

export async function uploadFile(fileUpload, scopeInfo) {
    if (!fileUpload || !fileUpload.save) {
        abort(400, 'Không tìm thấy file để mã hóa')
    }

    const scope = ['Public', 'Internal', 'Private'].includes(scopeInfo) ? scopeInfo : 'Public'

    // Lưu file vào thư mục dựa trên scope
    const savedPath = await fileUpload.save(scope.toLowerCase())

    // Lấy kích thước file với buffer (nếu có lúc runtime)
    const size = fileUpload.buffer ? Buffer.byteLength(fileUpload.buffer) : 0

    // Chuẩn hoá đường dẫn
    const normalizedPath = savedPath.replace(/\\/g, '/')
    const finalUrl = `${LINK_STATIC_URL}${normalizedPath}`

    // Tạo record trên DB
    const newFile = await File.create({
        filename: fileUpload.filename,
        originalname: fileUpload.originalname,
        mimetype: fileUpload.mimetype,
        size: size,
        url: finalUrl,
        scope: scope
    })

    return {
        url: finalUrl,
        id: newFile._id,
        filename: newFile.originalname
    }
}

export async function getFileInfo(id) {
    const fileInfo = await File.findOne({ _id: id, deleted: false })
    if (!fileInfo) {
        abort(404, 'Không tìm thấy thông tin file')
    }

    return {
        id: fileInfo._id,
        filename: fileInfo.filename,
        originalname: fileInfo.originalname,
        mimetype: fileInfo.mimetype,
        size: fileInfo.size,
        url: fileInfo.url,
        scope: fileInfo.scope,
        createdAt: fileInfo.createdAt
    }
}
