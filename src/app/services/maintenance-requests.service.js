import { MaintenanceRequests, Resident } from '@/models'
import { abort } from '@/utils/helpers'
import { triggerAutomaticNotification } from './notification.service'

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
    if (!data.resident_id) {
        abort(404, 'Truyen resident vao maintenace_requests')
    }

    const resident = await Resident.findById(data.resident_id).lean()
    if (!resident) {
        abort(404, 'Resident not found')
    }

    data.apartment_id = resident.apartment_id

    const lastMaintenace_requests = await MaintenanceRequests.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
    const nextId = lastMaintenace_requests && lastMaintenace_requests.id ? (parseInt(lastMaintenace_requests.id) + 1).toString().padStart(3, '0') : '001'
    data.id = nextId

    if (!data.Maintenance_Requests_code) {
        data.Maintenance_Requests_code = `MR${nextId}`
    }


    const res = await MaintenanceRequests.create(data)
    triggerAutomaticNotification('MAINTENANCE_CREATED', { request: res })
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
    triggerAutomaticNotification('MAINTENANCE_ASSIGNED', { request: res })
    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null
    return res
}

export const updateStatusMaintenance_requests = async (id, data) => {
    const updateData = {
        status: data.status
    }

    const res = await MaintenanceRequests.findByIdAndUpdate(id, updateData, { new: true }).populate('resident_id')
    if (!res) {
        abort(404, 'MaintenanceRequests not found')
    }

    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null

    return res
}

export const closeMaintenance_requests = async (id) => {
    const updateData = {
        status: 'closed',
        completed_at: new Date()
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
        query.created_at = {}
        if (filters.startDate) query.created_at.$gte = new Date(filters.startDate)
        if (filters.endDate) query.created_at.$lte = new Date(filters.endDate)
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
                            { $and: [{ $eq: ['$status', 'closed'] }, { $ne: ['$completed_at', null] }] },
                            { $subtract: ['$completed_at', '$created_at'] },
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

export const deleteMaintenance_requests = async (id) => {
    const res = await MaintenanceRequests.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'MaintenanceRequests not found')
    }
    return res
}

export const getMaintenanceStatusStats = async () => {
    const counts = await MaintenanceRequests.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ])

    const result = {
        new: 0,
        in_progress: 0,
        completed: 0,
        closed: 0
    }

    counts.forEach(c => {
        const status = c._id
        const count = c.count
        if (status === 'new') {
            result.new = count
        } else if (status === 'assigned' || status === 'in_progress') {
            result.in_progress += count
        } else if (status === 'completed') {
            result.completed = count
        } else if (status === 'closed') {
            result.closed = count
        }
    })

    return result
}

export const getUrgentMaintenanceRequests = async ({ limit = 5 } = {}) => {
    const requests = await MaintenanceRequests.find({
        status: { $in: ['new', 'assigned', 'in_progress'] },
        priority: { $in: ['urgent', 'high'] }
    })
        .populate('apartment_id')
        .sort({ created_at: -1 })
        .limit(limit)
        .lean()

    return requests.map(req => ({
        id: req._id.toString(),
        apartment_code: req.apartment_id ? req.apartment_id.apartment_code : '',
        title: req.title || '',
        priority: req.priority,
        status: req.status,
        created_at: req.created_at
    }))
}