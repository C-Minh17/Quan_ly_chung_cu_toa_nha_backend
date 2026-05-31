import { MaintenanceSchedules, User } from '@/models'
import { abort } from '@/utils/helpers'

export const getMaintenance_schedules = async () => {
    const res = await MaintenanceSchedules.find().populate('assigned_to').lean()
    if (!res) {
        abort(404, 'MaintenanceSchedules not found')
    }
    return res.map(maintenance_schedules => {
        return maintenance_schedules
    })
}

export const getByIdMaintenance_schedules = async (id) => {
    const res = await MaintenanceSchedules.findById(id).populate('assigned_to').lean()
    if (!res) {
        abort(404, 'MaintenanceSchedules not found')
    }
    return res
}

export const postMaintenance_schedules = async (data) => {
    if (!data.assigned_to) {
        abort(404, 'pass assigned number to Maintenance_schedules')
    }

    const assignedUser = await User.findById(data.assigned_to)
    if (!assignedUser) {
        abort(404, 'Assigned user not found')
    }
    if (assignedUser.role !== 'STAFF') {
        abort(400, 'Assigned user must be a STAFF')
    }

    const lastMaintenace_schedules = await MaintenanceSchedules.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
    const nextId = lastMaintenace_schedules && lastMaintenace_schedules.id ? (parseInt(lastMaintenace_schedules.id) + 1).toString().padStart(3, '0') : '001'
    data.id = nextId

    if (!data.Maintenance_Schedules_id) {
        data.Maintenance_Schedules_id = `MS${nextId}`
    }

    const res = await MaintenanceSchedules.create(data)
    const populate = await MaintenanceSchedules.findById(res._id)
        .populate({
            path: 'assigned_to'
        }).lean()

    if (!populate) {
        populate.assigned = populate.assigned_to
        delete populate.assigned_to
    }
}

export const updateMaintenance_schedules = async (id, data) => {
    if (data.assigned_to) {
        const assignedUser = await User.findById(data.assigned_to)
        if (!assignedUser) {
            abort(404, 'Assigned user not found')
        }
        if (assignedUser.role !== 'STAFF') {
            abort(400, 'Assigned user must be a STAFF')
        }
    }

    const res = await MaintenanceSchedules.findByIdAndUpdate(id, data, { new: true })
        .populate({
            path: 'assigned_to'
        })
    if (!res) {
        abort(404, 'MaintenanceSchedules not found')
    }
    res.assigned = res.assigned_to
    res.assigned_to = res.assigned ? res.assigned_to : null
    return res
}

export const deleteMaintenance_schedules = async (id) => {
    const res = await MaintenanceSchedules.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'MaintenanceSchedules not found')
    }
    return res
}

export const completeMaintenance_schedules = async (id) => {
    const schedule = await MaintenanceSchedules.findById(id)
    if (!schedule) {
        abort(404, 'MaintenanceSchedules not found')
    }

    const currentFrequency = schedule.frequency ? schedule.frequency.trim() : 'none'
    const currentStatus = schedule.status ? schedule.status.trim() : 'scheduled'

    if (currentStatus === 'completed') {
        return { message: 'Schedule is already completed', completed: schedule }
    }

    schedule.status = 'completed'
    await schedule.save()

    if (['weekly', 'monthly', 'quarterly', 'yearly'].includes(currentFrequency)) {
        const nextDate = new Date(schedule.scheduled_date || Date.now())
        if (currentFrequency === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7)
        } else if (currentFrequency === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1)
        } else if (currentFrequency === 'quarterly') {
            nextDate.setMonth(nextDate.getMonth() + 3)
        } else if (currentFrequency === 'yearly') {
            nextDate.setFullYear(nextDate.getFullYear() + 1)
        }

        const lastMaintenace_schedules = await MaintenanceSchedules.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
        const nextId = lastMaintenace_schedules && lastMaintenace_schedules.id ? (parseInt(lastMaintenace_schedules.id) + 1).toString().padStart(3, '0') : '001'

        const newScheduleData = {
            Maintenance_Schedules_id: `MS${nextId}`,
            id: nextId,
            title: schedule.title,
            description: schedule.description,
            frequency: currentFrequency,
            scheduled_date: nextDate,
            assigned_to: schedule.assigned_to,
            status: 'scheduled'
        }

        const newSchedule = await MaintenanceSchedules.create(newScheduleData)
        return { completed: schedule, nextSchedule: newSchedule }
    }

    return { completed: schedule }
}

export const getMaintenanceSchedulesByEmployee = async (employeeId) => {
    const employee = await User.findById(employeeId)
    if (!employee) {
        abort(404, 'Employee not found')
    }
    if (employee.role !== 'STAFF') {
        abort(400, 'Assigned user must be a STAFF')
    }

    const res = await MaintenanceSchedules.find({ assigned_to: employeeId }).populate('assigned_to').lean()
    return res
}