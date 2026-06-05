import { Apartment, Resident, Invoices, MaintenanceRequests, Payments, Contract } from '@/models'

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 0) return 'Vừa xong'

    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) return `${interval} năm trước`

    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) return `${interval} tháng trước`

    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return `${interval} ngày trước`

    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return `${interval} giờ trước`

    interval = Math.floor(seconds / 60)
    if (interval >= 1) return `${interval} phút trước`

    return 'Vừa xong'
}

export const getDashboardMetrics = async () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 1-indexed

    const currentMonthStart = new Date(currentYear, currentMonth - 1, 1)
    const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999)

    let prevMonth = currentMonth - 1
    let prevYear = currentYear
    if (prevMonth === 0) {
        prevMonth = 12
        prevYear -= 1
    }
    const prevMonthStart = new Date(prevYear, prevMonth - 1, 1)
    const prevMonthEnd = new Date(prevYear, prevMonth, 0, 23, 59, 59, 999)

    // 1. Apartment Metrics
    const totalApartments = await Apartment.countDocuments()
    const occupiedApartments = await Apartment.countDocuments({ status: 'occupied' })
    const occupiedPercentage = totalApartments > 0 ? Math.round((occupiedApartments / totalApartments) * 100) : 0

    // Occupancy trend: growth in occupied apartments (active contracts starting this month vs last month)
    const currentMonthContracts = await Contract.countDocuments({ status: 'active', start_date: { $gte: currentMonthStart, $lte: currentMonthEnd } })
    const prevMonthContracts = await Contract.countDocuments({ status: 'active', start_date: { $gte: prevMonthStart, $lte: prevMonthEnd } })
    let apartmentTrendPercentage = 0
    if (prevMonthContracts > 0) {
        apartmentTrendPercentage = Math.round(((currentMonthContracts - prevMonthContracts) / prevMonthContracts) * 100 * 10) / 10
    } else if (currentMonthContracts > 0) {
        apartmentTrendPercentage = 100
    }

    // 2. Resident Metrics
    const totalResidents = await Resident.countDocuments()
    const permanentResidents = await Resident.countDocuments({ resident_type: 'owner' })
    const temporaryResidents = await Resident.countDocuments({ resident_type: 'tenant' })
    const trendNewResidents = await Resident.countDocuments({ created_at: { $gte: currentMonthStart, $lte: currentMonthEnd } })

    // 3. Finance Metrics
    const currentInvoices = await Invoices.find({ billing_month: currentMonth, billing_year: currentYear })
    let billingMonthTotal = 0
    let paidAmount = 0
    currentInvoices.forEach(inv => {
        billingMonthTotal += inv.total_amount || 0
        paidAmount += inv.paid_amount || 0
    })
    const paidPercentage = billingMonthTotal > 0 ? Math.round((paidAmount / billingMonthTotal) * 100) : 0

    // Finance trend: comparing current month total billing to previous month
    const prevInvoices = await Invoices.find({ billing_month: prevMonth, billing_year: prevYear })
    let prevBillingTotal = 0
    prevInvoices.forEach(inv => {
        prevBillingTotal += inv.total_amount || 0
    })
    let financeTrendPercentage = 0
    if (prevBillingTotal > 0) {
        financeTrendPercentage = Math.round(((billingMonthTotal - prevBillingTotal) / prevBillingTotal) * 100 * 10) / 10
    } else if (billingMonthTotal > 0) {
        financeTrendPercentage = 100
    }

    // 4. Maintenance Metrics
    const totalPendingMaintenance = await MaintenanceRequests.countDocuments({ status: { $in: ['new', 'assigned', 'in_progress'] } })
    const urgentMaintenanceCount = await MaintenanceRequests.countDocuments({ status: { $in: ['new', 'assigned', 'in_progress'] }, priority: { $in: ['urgent', 'high'] } })

    // Maintenance trend: difference in requests created this month vs last month
    const currentMonthRequests = await MaintenanceRequests.countDocuments({ created_at: { $gte: currentMonthStart, $lte: currentMonthEnd } })
    const prevMonthRequests = await MaintenanceRequests.countDocuments({ created_at: { $gte: prevMonthStart, $lte: prevMonthEnd } })
    const maintenanceTrendChange = currentMonthRequests - prevMonthRequests

    return {
        apartments: {
            total: totalApartments,
            occupied: occupiedApartments,
            occupied_percentage: occupiedPercentage,
            trend_percentage: apartmentTrendPercentage
        },
        residents: {
            total: totalResidents,
            permanent: permanentResidents,
            temporary: temporaryResidents,
            trend_new: trendNewResidents
        },
        finance: {
            billing_month_total: billingMonthTotal,
            paid_amount: paidAmount,
            paid_percentage: paidPercentage,
            trend_percentage: financeTrendPercentage
        },
        maintenance: {
            total_pending: totalPendingMaintenance,
            urgent_count: urgentMaintenanceCount,
            trend_change: maintenanceTrendChange
        }
    }
}

export const getRecentActivities = async ({ limit = 10 } = {}) => {
    const activities = []

    // 1. Fetch recent residents
    const residents = await Resident.find()
        .populate(['user_id', 'apartment_id'])
        .sort({ created_at: -1 })
        .limit(limit)
        .lean()

    residents.forEach(res => {
        const residentName = res.user_id?.name || 'Cư dân mới'
        const apartmentCode = res.apartment_id?.apartment_code || 'Căn hộ'
        const typeLabel = res.resident_type === 'owner' ? 'thường trú' : 'tạm trú'
        activities.push({
            title: 'Thêm mới cư dân',
            description: `Cư dân ${residentName} đã đăng ký ${typeLabel} tại căn hộ ${apartmentCode}.`,
            date: res.created_at || new Date(),
            type: 'user'
        })
    })

    // 2. Fetch recent payments
    const payments = await Payments.find()
        .populate({
            path: 'invoice_id',
            populate: { path: 'apartment_id' }
        })
        .sort({ paid_at: -1 })
        .limit(limit)
        .lean()

    payments.forEach(pay => {
        const apartmentCode = pay.invoice_id?.apartment_id?.apartment_code || 'Căn hộ'
        const amountStr = (pay.amount || 0).toLocaleString('vi-VN')
        const methodStr = pay.payment_method === 'bank_transfer' ? 'Chuyển khoản' : pay.payment_method
        activities.push({
            title: 'Thanh toán hóa đơn',
            description: `Căn hộ ${apartmentCode} đã thanh toán hóa đơn phí quản lý qua ${methodStr} (${amountStr} đ).`,
            date: pay.paid_at || pay.created_at || new Date(),
            type: 'payment'
        })
    })

    // 3. Fetch recent maintenance requests
    const maintenanceRequests = await MaintenanceRequests.find()
        .populate('apartment_id')
        .sort({ created_at: -1 })
        .limit(limit)
        .lean()

    maintenanceRequests.forEach(mr => {
        const apartmentCode = mr.apartment_id?.apartment_code || 'Căn hộ'
        activities.push({
            title: 'Yêu cầu sửa chữa',
            description: `Căn hộ ${apartmentCode} đã gửi yêu cầu sửa chữa: "${mr.title}".`,
            date: mr.created_at || new Date(),
            type: 'maintenance'
        })

        if (mr.status === 'completed' || mr.status === 'closed') {
            activities.push({
                title: 'Hoàn thành sửa chữa',
                description: `Yêu cầu sửa chữa "${mr.title}" tại căn hộ ${apartmentCode} đã hoàn thành.`,
                date: mr.completed_at || mr.updated_at || new Date(),
                type: 'maintenance'
            })
        }
    })

    // Sort combined activities by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Slice to limit
    const slicedActivities = activities.slice(0, limit)

    // Format with id and timeAgo
    return slicedActivities.map((act, index) => ({
        id: index + 1,
        title: act.title,
        description: act.description,
        time_ago: timeAgo(act.date),
        type: act.type
    }))
}
