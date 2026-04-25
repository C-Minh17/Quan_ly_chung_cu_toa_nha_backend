import { MaintenanceRequests, Resident } from '@/models'
import { abort } from '@/utils/helpers'

export const getMaintenance_requests = async () => {
    const res = await MaintenanceRequests.find().populate('resident_id').lean()
    if (!res) {
        abort(404, 'MaintenanceRequests not found')
    }
    return res.map(maintenance_requests => {
        return maintenance_requests
    })
}
export const createMaintenance_requests = async (data) => {
    if (!data.apartment_id || !data.resident_id) {
        abort(404, 'Truyen apartment va resident vao maintenace_requests')
    }
    const lastMaintenace_requests = await MaintenanceRequests.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
    const nextId = lastMaintenace_requests && lastMaintenace_requests.id ? (parseInt(lastMaintenace_requests.id) + 1).toString().padStart(3, '0') : '001'
    data.id = nextId

    if (!data.Maintenance_Requests_code) {
        data.Maintenance_Requests_code = `MR${nextId}`
    }


    const res = await MaintenanceRequests.create(data)
    const populate = await MaintenanceRequests.findById(res._id)
        .populate([
            { path: 'apartment_id' },
            { path: 'resident_id' }
        ])
        .lean()
    if (populate) {
        populate.apartment = populate.apartment_id
        delete populate.apartment_id
        populate.resident = populate.resident_id
        delete populate.resident_id
    }
    return populate
}

export const getByIdMaintenance_requests = async (id) => {
    const res = await MaintenanceRequests.findById(id).populate('resident_id').lean()
    if (!res) {
        abort(404, 'MaintienanceRequests not found')
    }
    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null
    return res
}

export const updateMaintenance_requests = async (id, data) => {
    const res = await MaintenanceRequests.findByIdAndUpdate(id, data, { new: true }).populate('resident_id')
    if (!res) {
        abort(404, 'MaintienanceRequests not found')
    }
    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null
    return res
}

export const assignMaintenance_requests = async (id, data) => {
    data.status = 'assigned'
    data.assigned_at = new Date()

    const res = await MaintenanceRequests.findByIdAndUpdate(id, data, { new: true }).populate('resident_id')
    if (!res) {
        abort(404, 'MaintenanceRequests not found')
    }
    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null
    return res
}

export const updateStatusMaintenance_requests = async (id, data) => {
    const updateData = {
        status: data.status
    }
    if (typeof data.progress_note !== 'undefined') {
        updateData.progress_note = data.progress_note
    }
    if (typeof data.back_maintenance_images !== 'undefined') {
        updateData.back_maintenance_images = data.back_maintenance_images
    }

    const res = await MaintenanceRequests.findByIdAndUpdate(id, updateData, { new: true }).populate('resident_id')
    if (!res) {
        abort(404, 'MaintenanceRequests not found')
    }

    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null

    return res
}

export const closeMaintenance_requests = async (id, data) => {
    const updateData = {
        status: 'closed',
        closed_at: new Date()
    }
    if (typeof data.closing_note !== 'undefined') {
        updateData.closing_note = data.closing_note
    }

    const res = await MaintenanceRequests.findByIdAndUpdate(id, updateData, { new: true }).populate('resident_id')
    if (!res) {
        abort(404, 'MaintenanceRequests not found')
    }

    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null

    return res
}

export const rateMaintenance_requests = async (id, data) => {
    const res = await MaintenanceRequests.findByIdAndUpdate(
        id,
        {
            rating: data.rating,
            feedback: data.feedback
        },
        { new: true }
    ).populate('resident_id')

    if (!res) {
        abort(404, 'MaintenanceRequests not found')
    }

    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null

    return res
}

export const getMyMaintenance_requests = async (userId) => {
    const residents = await Resident.find({ user_id: userId }).select('_id')
    const residentIds = residents.map(r => r._id)

    const res = await MaintenanceRequests.find({ resident_id: { $in: residentIds } })
        .populate([
            { path: 'apartment_id' },
            { path: 'resident_id' }
        ])
        .lean()

    return res.map(item => {
        item.apartment = item.apartment_id
        item.resident = item.resident_id
        return item
    })
}

export const getMaintenanceStats = async (filters = {}) => {
    const query = {}
    if (filters.startDate || filters.endDate) {
        query.create_at = {}
        if (filters.startDate) query.create_at.$gte = new Date(filters.startDate)
        if (filters.endDate) query.create_at.$lte = new Date(filters.endDate)
    }

    const stats = await MaintenanceRequests.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                avgProcessingTimeMs: {
                    $avg: {
                        $cond: [
                            { $and: [{ $eq: ['$status', 'closed'] }, { $ne: ['$closed_at', null] }] },
                            { $subtract: ['$closed_at', '$create_at'] },
                            null
                        ]
                    }
                }
            }
        },
        {
            $project: {
                status: '$_id',
                count: 1,
                avgProcessingTimeHours: {
                    $round: [{ $divide: ['$avgProcessingTimeMs', 1000 * 60 * 60] }, 2]
                },
                _id: 0
            }
        }
    ])

    return stats
}