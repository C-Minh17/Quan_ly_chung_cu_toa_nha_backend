import mongoose from 'mongoose'
import moment from 'moment'
import {
    Notification,
    NotificationReceiver,
    UserDevice,
    User,
    Resident,
    Building,
    Floor,
    Apartment
} from '@/models'
import { abort } from '@/utils/helpers'
import { mailTransporter, MAIL_FROM_ADDRESS, MAIL_FROM_NAME } from '@/configs'

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || ''
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY || ''

/**
 * Utility helper to send push notifications via OneSignal
 */
export const sendPushNotification = async (playerIds, heading, content) => {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
        console.warn('[NotificationService] OneSignal not configured. Skipping push notification.')
        return
    }
    if (!playerIds || playerIds.length === 0) {
        return
    }

    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                include_player_ids: playerIds,
                headings: { en: heading, vi: heading },
                contents: { en: content, vi: content }
            })
        })

        if (!response.ok) {
            const errBody = await response.text()
            console.error('[NotificationService] OneSignal Push Error:', errBody)
        }
    } catch (err) {
        console.error('[NotificationService] Failed to send push notification:', err.message)
    }
}

/**
 * Utility helper to send emails to users
 */
export const sendEmailNotification = async (user, title, description, content) => {
    if (!user.email) return

    try {
        await new Promise((resolve, reject) => {
            mailTransporter.sendMail({
                from: {
                    address: MAIL_FROM_ADDRESS,
                    name: MAIL_FROM_NAME || 'Ban Quản Trị'
                },
                to: user.email,
                subject: title,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #1890ff; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">${title}</h2>
                        <p style="font-size: 16px; color: #333;">${description || ''}</p>
                        <div style="margin-top: 20px; padding: 15px; background-color: #fafafa; border-radius: 4px; color: #555;">
                            ${content || ''}
                        </div>
                        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">Đây là thông báo tự động từ Hệ thống Quản lý Tòa nhà. Vui lòng không trả lời email này.</p>
                    </div>
                `
            }, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })
    } catch (err) {
        console.error('[NotificationService] Failed to send email:', err.message)
    }
}

/**
 * Get all resident user IDs in a partition (Building)
 */
export const getUserIdsInPartition = async (dataPartitionCode) => {
    if (!dataPartitionCode) {
        return await Resident.find({ user_id: { $ne: null } }).distinct('user_id')
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(dataPartitionCode)
    const buildingQuery = isObjectId
        ? { $or: [{ _id: dataPartitionCode }, { id: dataPartitionCode }] }
        : { id: dataPartitionCode }

    const building = await Building.findOne(buildingQuery)
    if (!building) {
        return await Resident.find({ user_id: { $ne: null } }).distinct('user_id')
    }

    const floors = await Floor.find({ building_id: building._id }).distinct('_id')
    const apartments = await Apartment.find({ floor_id: { $in: floors } }).distinct('_id')
    return await Resident.find({ apartment_id: { $in: apartments }, user_id: { $ne: null } }).distinct('user_id')
}

/**
 * ADMIN: Create notification
 */
export const createNotification = async (payload, dataPartitionCode) => {
    const {
        title,
        description,
        content,
        type,
        receiverType,
        userList,
        imageUrl,
        taiLieuDinhKem,
        thoiGianHieuLuc
    } = payload

    if (!title) {
        abort(400, 'Tiêu đề thông báo không được để trống.')
    }

    const notification = await Notification.create({
        title,
        description,
        content,
        type: type || 'OneSignalService',
        sourceType: 'NOTIFICATION',
        notificationInternal: false,
        imageUrl,
        taiLieuDinhKem,
        thoiGianHieuLuc,
        dataPartitionCode
    })

    // Resolve target users
    let targetUserIds = []
    if (receiverType === 'All') {
        targetUserIds = await getUserIdsInPartition(dataPartitionCode)
    } else if (receiverType === 'User' && userList && userList.length > 0) {
        targetUserIds = userList.map(u => u.ssoId || u._id || u.userId).filter(Boolean)
    }

    if (targetUserIds.length > 0) {
        const receiverRecords = targetUserIds.map(userId => ({
            notificationId: notification._id,
            userId
        }))
        await NotificationReceiver.insertMany(receiverRecords)

        // Send pushes if requested
        if (type === 'OneSignalService' || type === 'All') {
            const playerIds = await UserDevice.find({ userId: { $in: targetUserIds } }).distinct('playerId')
            await sendPushNotification(playerIds, title, description || title)
        }

        // Send emails if requested
        if (type === 'Email' || type === 'All') {
            const users = await User.find({ _id: { $in: targetUserIds }, email: { $ne: null } })
            for (const user of users) {
                await sendEmailNotification(user, title, description, content)
            }
        }
    }

    return notification
}

/**
 * ADMIN: Get notifications page
 */
export const getNotificationPage = async (query, dataPartitionCode) => {
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10

    let condition = {}
    if (query.condition) {
        try {
            condition = typeof query.condition === 'string' ? JSON.parse(query.condition) : query.condition
        } catch (e) {
            console.error('[NotificationService] Parse condition query failed:', e.message)
        }
    }

    if (dataPartitionCode) {
        condition.dataPartitionCode = dataPartitionCode
    }

    let sort = { createdAt: -1 }
    if (query.sort) {
        try {
            sort = typeof query.sort === 'string' ? JSON.parse(query.sort) : query.sort
        } catch (e) {
            console.error('[NotificationService] Parse sort query failed:', e.message)
        }
    }

    const result = await Notification.find(condition)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const total = await Notification.countDocuments(condition)

    return { result, total }
}

/**
 * ADMIN: Delete notification
 */
export const deleteNotification = async (id) => {
    const res = await Notification.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'Thông báo không tồn tại.')
    }
    await NotificationReceiver.deleteMany({ notificationId: id })
    return { success: true }
}

/**
 * ADMIN: Get receivers list page
 */
export const getReceiversPage = async (notificationId, query) => {
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10

    const condition = { notificationId }
    const result = await NotificationReceiver.find(condition)
        .populate('userId', 'name email phone preferred_username ssoId picture')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const total = await NotificationReceiver.countDocuments(condition)

    return { result, total }
}

/**
 * CLIENT: Register player ID
 */
export const initUserDevice = async (userId, playerId, deviceType) => {
    if (!playerId) {
        abort(400, 'Thiếu playerId.')
    }

    const device = await UserDevice.findOneAndUpdate(
        { playerId },
        {
            userId,
            updatedAt: new Date(),
            deviceType: deviceType || 'Web'
        },
        { upsert: true, new: true }
    )

    return device
}

/**
 * CLIENT: Get personal notifications page
 */
export const getMyNotifications = async (userId, query, dataPartitionCode) => {
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10

    const notifFilter = {}
    if (dataPartitionCode) {
        notifFilter.dataPartitionCode = dataPartitionCode
    }

    // Filter valid (unexpired) notifications
    notifFilter.$or = [
        { thoiGianHieuLuc: { $exists: false } },
        { thoiGianHieuLuc: null },
        { thoiGianHieuLuc: { $gte: new Date() } }
    ]

    const validNotifIds = await Notification.find(notifFilter).distinct('_id')

    const receiverFilter = {
        userId,
        notificationId: { $in: validNotifIds }
    }

    const total = await NotificationReceiver.countDocuments(receiverFilter)
    const unread = await NotificationReceiver.countDocuments({ ...receiverFilter, read: false })

    const list = await NotificationReceiver.find(receiverFilter)
        .populate('notificationId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    const result = list.map(item => ({
        _id: item._id,
        read: item.read,
        readAt: item.readAt,
        createdAt: item.createdAt,
        notification: item.notificationId
    }))

    return { result, unread, total }
}

/**
 * CLIENT: Mark read/read all
 */
export const readNotification = async (userId, payload) => {
    const { type, notificationId } = payload

    if (type === 'ONE') {
        if (!notificationId) {
            abort(400, 'Thiếu notificationId.')
        }
        await NotificationReceiver.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true, readAt: new Date() }
        )
    } else if (type === 'ALL') {
        await NotificationReceiver.updateMany(
            { userId, read: false },
            { read: true, readAt: new Date() }
        )
    } else {
        abort(400, 'Type không hợp lệ. Phải là ONE hoặc ALL.')
    }

    return { success: true }
}

/**
 * System Hook: Trigger automated notification
 */
export const triggerAutomaticNotification = async (event, data) => {
    try {
        let title = ''
        let description = ''
        let content = ''
        let senderName = 'Hệ thống'
        const type = 'All' // Push + Email
        let sourceType = 'NOTIFICATION'
        let dataPartitionCode = ''
        let targetUserIds = []

        if (event === 'INVOICE_CREATED') {
            const { invoice } = data
            const apartment = await Apartment.findById(invoice.apartment_id).populate({
                path: 'floor_id',
                populate: { path: 'building_id' }
            })
            const apartmentCode = apartment?.apartment_code || ''
            dataPartitionCode = apartment?.floor_id?.building_id?.id || apartment?.floor_id?.building_id?._id?.toString() || ''

            title = `Hóa đơn mới cần thanh toán - Tháng ${invoice.billing_month}/${invoice.billing_year}`
            description = `Quý cư dân có hóa đơn mới trị giá ${invoice.total_amount.toLocaleString('vi-VN')}đ cần thanh toán trước ngày ${moment(invoice.due_date).format('DD/MM/YYYY')}.`
            content = `
                <p>Hệ thống đã phát hành hóa đơn mới cho căn hộ <strong>${apartmentCode}</strong>.</p>
                <ul>
                    <li>Tháng: ${invoice.billing_month}/${invoice.billing_year}</li>
                    <li>Số tiền: <strong>${invoice.total_amount.toLocaleString('vi-VN')} đ</strong></li>
                    <li>Hạn thanh toán: ${moment(invoice.due_date).format('DD/MM/YYYY')}</li>
                </ul>
                <p>Vui lòng thanh toán đúng hạn.</p>
            `
            sourceType = 'TC'

            // Target: all residents of this apartment
            targetUserIds = await Resident.find({ apartment_id: invoice.apartment_id, user_id: { $ne: null } }).distinct('user_id')

        } else if (event === 'INVOICE_PAID') {
            const { invoice } = data
            const apartment = await Apartment.findById(invoice.apartment_id).populate({
                path: 'floor_id',
                populate: { path: 'building_id' }
            })
            dataPartitionCode = apartment?.floor_id?.building_id?.id || apartment?.floor_id?.building_id?._id?.toString() || ''

            title = 'Thanh toán hóa đơn thành công'
            description = `Hệ thống đã ghi nhận thanh toán thành công hóa đơn tháng ${invoice.billing_month}/${invoice.billing_year} trị giá ${invoice.total_amount.toLocaleString('vi-VN')}đ. Cảm ơn quý cư dân.`
            content = `
                <p>Cảm ơn quý cư dân.</p>
                <p>Hóa đơn dịch vụ tháng ${invoice.billing_month}/${invoice.billing_year} trị giá <strong>${invoice.total_amount.toLocaleString('vi-VN')} đ</strong> đã được thanh toán hoàn tất.</p>
            `
            sourceType = 'TC'

            // Target: all residents of this apartment
            targetUserIds = await Resident.find({ apartment_id: invoice.apartment_id, user_id: { $ne: null } }).distinct('user_id')

        } else if (event === 'MAINTENANCE_CREATED') {
            const { request } = data
            const resident = await Resident.findById(request.resident_id).populate('user_id')
            senderName = resident?.user_id?.name || 'Cư dân'

            const apartment = await Apartment.findById(request.apartment_id).populate({
                path: 'floor_id',
                populate: { path: 'building_id' }
            })
            const apartmentCode = apartment?.apartment_code || ''
            dataPartitionCode = apartment?.floor_id?.building_id?.id || apartment?.floor_id?.building_id?._id?.toString() || ''

            title = `Yêu cầu hỗ trợ mới từ căn hộ ${apartmentCode}`
            description = `Yêu cầu sự cố: ${request.title} cần được tiếp nhận và phân công xử lý.`
            content = `
                <p>Cư dân <strong>${senderName}</strong> tại căn hộ <strong>${apartmentCode}</strong> vừa tạo một yêu cầu hỗ trợ sửa chữa:</p>
                <blockquote><strong>${request.title}</strong><br/>${request.description || ''}</blockquote>
                <p>Vui lòng đăng nhập hệ thống để tiếp nhận và phân công nhân sự.</p>
            `
            sourceType = 'CSVC'

            // Target: all admins, managers and staff
            const admins = await User.find({ role: { $in: ['SUPER_ADMIN', 'MANAGER', 'STAFF'] }, deleted: false })
            targetUserIds = admins.map(u => u._id)

        } else if (event === 'MAINTENANCE_ASSIGNED') {
            const { request } = data
            if (!request.assigned_to) return

            const worker = await User.findById(request.assigned_to)
            if (!worker) return

            const apartment = await Apartment.findById(request.apartment_id).populate({
                path: 'floor_id',
                populate: { path: 'building_id' }
            })
            const apartmentCode = apartment?.apartment_code || ''
            dataPartitionCode = apartment?.floor_id?.building_id?.id || apartment?.floor_id?.building_id?._id?.toString() || ''

            let deadline = 'Theo phân công'
            if (request.priority === 'urgent') deadline = '4 giờ kể từ ngày phân công'
            else if (request.priority === 'high') deadline = '1 ngày kể từ ngày phân công'
            else if (request.priority === 'medium') deadline = '3 ngày kể từ ngày phân công'
            else if (request.priority === 'low') deadline = '5 ngày kể từ ngày phân công'

            senderName = 'Ban quản lý tòa nhà'
            title = 'Bạn có công việc mới được phân công'
            description = `Bạn đã được giao xử lý yêu cầu sửa chữa '${request.title}' tại căn hộ ${apartmentCode}. Hạn xử lý: ${deadline}.`
            content = `
                <p>Bạn có một công việc sửa chữa mới được phân công:</p>
                <ul>
                    <li><strong>Công việc:</strong> ${request.title}</li>
                    <li><strong>Căn hộ:</strong> ${apartmentCode}</li>
                    <li><strong>Mức độ:</strong> ${request.priority}</li>
                    <li><strong>Hạn xử lý:</strong> ${deadline}</li>
                </ul>
                <p>Vui lòng tiến hành xử lý và cập nhật trạng thái tiến độ công việc trên hệ thống.</p>
            `
            sourceType = 'CSVC'
            targetUserIds = [worker._id]
        }

        if (targetUserIds.length > 0) {
            // Save notification template to DB
            const notif = await Notification.create({
                title,
                description,
                content,
                senderName,
                type,
                sourceType,
                notificationInternal: true,
                dataPartitionCode
            })

            // Save receivers
            const receiverRecords = targetUserIds.map(userId => ({
                notificationId: notif._id,
                userId
            }))
            await NotificationReceiver.insertMany(receiverRecords)

            // Send push if player IDs exist
            const playerIds = await UserDevice.find({ userId: { $in: targetUserIds } }).distinct('playerId')
            if (playerIds.length > 0) {
                await sendPushNotification(playerIds, title, description || title)
            }

            // Send emails
            const users = await User.find({ _id: { $in: targetUserIds }, email: { $ne: null } })
            for (const user of users) {
                await sendEmailNotification(user, title, description, content)
            }
        }
    } catch (err) {
        console.error('[NotificationService] Automatic Trigger Error:', err)
    }
}
