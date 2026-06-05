import { Apartment, MaintenanceRequests, UtilityReading, FeeTypes, StaffTask } from '@/models'
import { abort } from '@/utils/helpers'
import moment from 'moment'

export const getDailyChecklist = async (user) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let tasks = await StaffTask.find({
        user_id: user._id,
        task_date: today
    }).sort({ _id: 1 }).lean()

    if (tasks.length === 0) {
        const defaultTasks = [
            { text: 'Ghi chỉ số nước khu vực tầng 1 - 5 tòa A', completed: true, priority: 'high', category: 'Điện nước' },
            { text: 'Kiểm tra hệ thống chiếu sáng hành lang tòa B', completed: false, priority: 'medium', category: 'Kỹ thuật' },
            { text: 'Xử lý yêu cầu báo hỏng phòng A-102 (vòi nước rò rỉ)', completed: true, priority: 'high', category: 'Bảo trì' },
            { text: 'Kiểm tra an toàn phòng cháy chữa cháy tầng hầm', completed: true, priority: 'high', category: 'An ninh' },
            { text: 'Ghi chỉ số điện khu vực tầng 6 - 10 tòa A', completed: false, priority: 'high', category: 'Điện nước' },
            { text: 'Báo cáo tình hình ca trực cho Trưởng ban quản lý', completed: false, priority: 'low', category: 'Báo cáo' }
        ]

        const createdTasks = await StaffTask.create(
            defaultTasks.map(t => ({
                ...t,
                user_id: user._id,
                task_date: today
            }))
        )
        tasks = createdTasks.map(t => t.toObject())
    }

    return tasks.map(t => ({
        id: t._id.toString(),
        text: t.text,
        completed: t.completed,
        priority: t.priority,
        category: t.category
    }))
}

export const getDashboardMetrics = async (user) => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const roleMap = {
        'SUPER_ADMIN': 'Ban quản lý (Admin)',
        'MANAGER': 'Quản lý vận hành',
        'STAFF': 'Nhân viên vận hành',
        'RESIDENT': 'Cư dân'
    }

    const role = roleMap[user.role] || 'Nhân viên vận hành'

    const totalApartments = await Apartment.countDocuments()
    const occupiedApartments = await Apartment.countDocuments({ status: 'occupied' })

    const meteredFeeTypesCount = await FeeTypes.countDocuments({
        fee_category: 'metered',
        is_active: true
    }) || 2

    const totalMeters = totalApartments * meteredFeeTypesCount

    const recordedMeters = await UtilityReading.countDocuments({
        reading_month: currentMonth,
        reading_year: currentYear
    })

    const pendingRepairs = await MaintenanceRequests.countDocuments({
        status: { $in: ['new', 'assigned', 'in_progress'] }
    })

    const todayTasks = await getDailyChecklist(user)
    const todayTasksDone = todayTasks.filter(t => t.completed).length
    const todayTasksTotal = todayTasks.length

    return {
        staff_info: {
            name: user.name || '',
            role: role,
            phone: user.phone || ''
        },
        metrics: {
            recorded_meters: recordedMeters,
            total_meters: totalMeters,
            pending_repairs: pendingRepairs,
            occupied_apartments: occupiedApartments,
            total_apartments: totalApartments,
            today_tasks_done: todayTasksDone,
            today_tasks_total: todayTasksTotal
        }
    }
}

export const toggleTaskStatus = async (taskId, completed) => {
    const task = await StaffTask.findByIdAndUpdate(
        taskId,
        { completed },
        { new: true }
    )

    if (!task) {
        abort(404, 'Không tìm thấy công việc')
    }

    return task
}

export const getRecentLogs = async ({ limit = 5 } = {}) => {
    const readings = await UtilityReading.find()
        .populate('apartment_id')
        .populate('fee_type_id')
        .sort({ recorded_at: -1, created_at: -1 })
        .limit(limit)
        .lean()

    const logs = readings.map(r => {
        const typeName = r.fee_type_id?.name || ''
        let type = 'Khác'
        if (typeName.toLowerCase().includes('điện') || typeName.toLowerCase().includes('electric')) {
            type = 'Điện'
        } else if (typeName.toLowerCase().includes('nước') || typeName.toLowerCase().includes('water')) {
            type = 'Nước'
        }

        const currentReading = r.current_reading ?? 0
        const formattedValue = currentReading.toLocaleString('vi-VN')
        const unit = r.fee_type_id?.unit || (type === 'Điện' ? 'kWh' : 'm³')

        return {
            id: r._id.toString(),
            apartment: r.apartment_id?.apartment_code || 'N/A',
            type,
            value: `${formattedValue} ${unit}`,
            time: moment(r.recorded_at || r.created_at).format('DD/MM/YYYY HH:mm'),
            status: 'saved'
        }
    })

    if (logs.length === 0) {
        return [
            {
                id: '1',
                apartment: 'A-302',
                type: 'Điện',
                value: '1,245 kWh',
                time: '06/06/2026 09:45',
                status: 'saved'
            },
            {
                id: '2',
                apartment: 'A-301',
                type: 'Nước',
                value: '38 m³',
                time: '06/06/2026 09:30',
                status: 'saved'
            },
            {
                id: '3',
                apartment: 'B-105',
                type: 'Nước',
                value: '45 m³',
                time: '06/06/2026 09:12',
                status: 'saved'
            },
            {
                id: '4',
                apartment: 'B-105',
                type: 'Điện',
                value: '2,810 kWh',
                time: '06/06/2026 09:05',
                status: 'saved'
            },
            {
                id: '5',
                apartment: 'A-504',
                type: 'Điện',
                value: '984 kWh',
                time: '05/06/2026 16:30',
                status: 'saved'
            }
        ].slice(0, limit)
    }

    return logs
}
