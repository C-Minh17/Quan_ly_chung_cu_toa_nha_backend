import * as NotificationService from '../services/notification.service'

// Admin: Create notification
export const createNotificationController = async (req, res) => {
    try {
        const dataPartitionCode = req.headers['x-data-partition-code'] || req.headers['X-Data-Partition-Code']
        const data = await NotificationService.createNotification(req.body, dataPartitionCode)
        return res.status(200).json({
            success: true,
            message: 'Tạo thông báo thành công',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Tạo thông báo thất bại',
            error: err.message
        })
    }
}

// Admin: Get paginated notifications
export const getNotificationPageController = async (req, res) => {
    try {
        const dataPartitionCode = req.headers['x-data-partition-code'] || req.headers['X-Data-Partition-Code']
        const data = await NotificationService.getNotificationPage(req.query, dataPartitionCode)
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách thông báo thành công',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Lấy danh sách thông báo thất bại',
            error: err.message
        })
    }
}

// Admin: Delete notification
export const deleteNotificationController = async (req, res) => {
    try {
        const data = await NotificationService.deleteNotification(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Xóa thông báo thành công',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Xóa thông báo thất bại',
            error: err.message
        })
    }
}

// Admin: Get receivers page
export const getReceiversPageController = async (req, res) => {
    try {
        const data = await NotificationService.getReceiversPage(req.params.id, req.query)
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách người nhận thành công',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Lấy danh sách người nhận thất bại',
            error: err.message
        })
    }
}

// Client: Register/update player ID
export const initOneSignalController = async (req, res) => {
    try {
        const userId = req.currentUser?._id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để thực hiện chức năng này.'
            })
        }
        const { playerId, deviceType } = req.body
        const data = await NotificationService.initUserDevice(userId, playerId, deviceType)
        return res.status(200).json({
            success: true,
            message: 'Đăng ký thiết bị thành công',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Đăng ký thiết bị thất bại',
            error: err.message
        })
    }
}

// Client: Get personal notifications
export const getMyNotificationsController = async (req, res) => {
    try {
        const userId = req.currentUser?._id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để thực hiện chức năng này.'
            })
        }
        const dataPartitionCode = req.headers['x-data-partition-code'] || req.headers['X-Data-Partition-Code']
        const data = await NotificationService.getMyNotifications(userId, req.query, dataPartitionCode)
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách thông báo cá nhân thành công',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Lấy danh sách thông báo cá nhân thất bại',
            error: err.message
        })
    }
}

// Client: Mark notification as read
export const readNotificationController = async (req, res) => {
    try {
        const userId = req.currentUser?._id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để thực hiện chức năng này.'
            })
        }
        const data = await NotificationService.readNotification(userId, req.body)
        return res.status(200).json({
            success: true,
            message: 'Đánh dấu đã đọc thành công',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Đánh dấu đã đọc thất bại',
            error: err.message
        })
    }
}
