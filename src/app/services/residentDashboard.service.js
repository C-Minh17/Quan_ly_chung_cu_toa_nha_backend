import { Resident, Apartment, Invoices, InvoiceDetails, AmenityBooking, MaintenanceRequests, Vehicle, Contract } from '@/models'
import { abort } from '@/utils/helpers'

const formatTimeSlot = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    const startHour = String(start.getHours()).padStart(2, '0')
    const startMin = String(start.getMinutes()).padStart(2, '0')
    const endHour = String(end.getHours()).padStart(2, '0')
    const endMin = String(end.getMinutes()).padStart(2, '0')
    
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    const dayName = days[start.getDay()]
    
    const day = String(start.getDate()).padStart(2, '0')
    const month = String(start.getMonth() + 1).padStart(2, '0')
    const year = start.getFullYear()
    
    return `${startHour}:${startMin} - ${endHour}:${endMin}, ${dayName} ${day}/${month}/${year}`
}

export const getDashboardMetrics = async (userId) => {
    const resident = await Resident.findOne({ user_id: userId })
        .populate([
            'user_id',
            {
                path: 'apartment_id',
                populate: {
                    path: 'floor_id',
                    populate: {
                        path: 'building_id'
                    }
                }
            }
        ])
        .lean()

    if (!resident) {
        abort(404, 'Không tìm thấy thông tin cư dân')
    }

    const apartment = resident.apartment_id
    let membersCount = 0
    let vehiclesSummary = 'Chưa đăng ký xe'

    if (apartment) {
        membersCount = await Resident.countDocuments({ apartment_id: apartment._id })

        const vehicles = await Vehicle.find({ resident_id: resident._id, deleted: { $ne: true } }).lean()
        const carCount = vehicles.filter(v => v.vehicle_type === 'car').length
        const motoCount = vehicles.filter(v => v.vehicle_type === 'motorbike').length
        const bikeCount = vehicles.filter(v => v.vehicle_type === 'bicycle').length

        const vehicleParts = []
        if (carCount > 0) vehicleParts.push(`${carCount} Ô tô`)
        if (motoCount > 0) vehicleParts.push(`${motoCount} Xe máy`)
        if (bikeCount > 0) vehicleParts.push(`${bikeCount} Xe đạp`)
        
        if (vehicleParts.length > 0) {
            vehiclesSummary = vehicleParts.join(' • ')
        }
    }

    // Calculations for metrics
    let unpaidAmount = 0
    let totalBillsCount = 0
    let paidBillsCount = 0
    let pendingMaintenanceCount = 0
    let upcomingBookingsCount = 0
    let contractStatus = 'none'
    let contractExpiryDate = null

    if (apartment) {
        const invoices = await Invoices.find({ apartment_id: apartment._id }).lean()
        totalBillsCount = invoices.length
        paidBillsCount = invoices.filter(inv => inv.status === 'paid').length

        const unpaidInvoices = invoices.filter(inv => ['unpaid', 'partial', 'overdue'].includes(inv.status))
        unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + ((inv.total_amount || 0) - (inv.paid_amount || 0)), 0)

        pendingMaintenanceCount = await MaintenanceRequests.countDocuments({
            apartment_id: apartment._id,
            status: { $in: ['new', 'assigned', 'in_progress'] }
        })

        upcomingBookingsCount = await AmenityBooking.countDocuments({
            resident_id: resident._id,
            start_time: { $gte: new Date() },
            status: { $in: ['pending', 'approved'] }
        })

        const contract = await Contract.findOne({ resident_id: resident._id, apartment_id: apartment._id })
            .sort({ created_at: -1 })
            .lean()

        if (contract) {
            contractStatus = contract.status || 'none'
            contractExpiryDate = contract.end_date ? contract.end_date.toISOString().split('T')[0] : null
        } else {
            contractStatus = apartment.contract_status || 'none'
            contractExpiryDate = apartment.contract_end_date ? apartment.contract_end_date.toISOString().split('T')[0] : null
        }
    }

    return {
        resident_info: {
            name: resident.user_id?.name || '',
            apartment_code: apartment?.apartment_code || 'Chưa nhận phòng',
            floor: apartment?.floor_id ? `Tầng ${apartment.floor_id.floor_number}` : 'Chưa có thông tin',
            building: apartment?.floor_id?.building_id?.name || 'Chưa có thông tin',
            members_count: membersCount,
            vehicles_summary: vehiclesSummary
        },
        metrics: {
            unpaid_amount: unpaidAmount,
            total_bills_count: totalBillsCount,
            paid_bills_count: paidBillsCount,
            pending_maintenance_count: pendingMaintenanceCount,
            upcoming_bookings_count: upcomingBookingsCount,
            contract_status: contractStatus,
            contract_expiry_date: contractExpiryDate
        }
    }
}

export const getCurrentBills = async (userId) => {
    const resident = await Resident.findOne({ user_id: userId }).lean()
    if (!resident) {
        abort(404, 'Không tìm thấy thông tin cư dân')
    }

    const apartmentId = resident.apartment_id
    if (!apartmentId) {
        return []
    }

    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()

    const invoices = await Invoices.find({
        apartment_id: apartmentId,
        billing_month: currentMonth,
        billing_year: currentYear
    }).lean()

    const bills = []
    for (const invoice of invoices) {
        const details = await InvoiceDetails.find({ invoice_id: invoice._id })
            .populate('fee_type_id')
            .lean()

        details.forEach(d => {
            bills.push({
                id: d._id.toString(),
                service: d.fee_type_id?.name || 'Phí dịch vụ',
                amount: d.amount || 0,
                status: invoice.status === 'paid' ? 'paid' : 'unpaid'
            })
        })

        if (invoice.rental_amount && invoice.rental_amount > 0) {
            bills.push({
                id: `${invoice._id}_rental`,
                service: 'Tiền thuê nhà',
                amount: invoice.rental_amount,
                status: invoice.status === 'paid' ? 'paid' : 'unpaid'
            })
        }
    }

    return bills
}

export const getUpcomingBookings = async (userId) => {
    const resident = await Resident.findOne({ user_id: userId }).lean()
    if (!resident) {
        abort(404, 'Không tìm thấy thông tin cư dân')
    }

    const bookings = await AmenityBooking.find({
        resident_id: resident._id,
        start_time: { $gte: new Date() }
    })
        .populate('amenity_id')
        .sort({ start_time: 1 })
        .lean()

    return bookings.map(b => ({
        id: b._id.toString(),
        amenity_name: b.amenity_id?.name || 'Tiện ích công cộng',
        time_slot: formatTimeSlot(b.start_time, b.end_time),
        status: b.status
    }))
}

export const getMaintenanceRequests = async (userId) => {
    const resident = await Resident.findOne({ user_id: userId }).lean()
    if (!resident) {
        abort(404, 'Không tìm thấy thông tin cư dân')
    }

    const apartmentId = resident.apartment_id
    if (!apartmentId) {
        return []
    }

    const requests = await MaintenanceRequests.find({ apartment_id: apartmentId })
        .sort({ created_at: -1 })
        .lean()

    const statusTextMap = {
        new: 'Mới tiếp nhận',
        assigned: 'Đã phân công',
        in_progress: 'Đang xử lý',
        completed: 'Đã hoàn thành',
        closed: 'Đã đóng'
    }

    return requests.map(r => ({
        id: r._id.toString(),
        title: r.title || '',
        date: r.created_at ? r.created_at.toISOString().split('T')[0] : '',
        status: r.status || 'new',
        status_text: statusTextMap[r.status] || 'Mới tiếp nhận'
    }))
}
