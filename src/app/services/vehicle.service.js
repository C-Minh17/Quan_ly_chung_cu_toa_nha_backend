import { Vehicle, Resident } from '@/models'
import { abort } from '@/utils/helpers'


const transformVehicle = (item) => {
    if (!item) return item

    const resident = item.resident_id
    const resident_id = resident?._id ? resident._id.toString() : (item.resident_id?._id || item.resident_id)

    let formattedResident = resident
    if (resident && typeof resident === 'object') {
        const user = resident.user_id
        const user_id = user?._id ? user._id.toString() : (resident.user_id?._id || resident.user_id)

        const apartment = resident.apartment_id
        const apartment_id = apartment?._id ? apartment._id.toString() : (resident.apartment_id?._id || resident.apartment_id)

        formattedResident = {
            ...resident,
            user_id,
            user: user,
            apartment_id,
            apartment: apartment
        }
    }

    return {
        ...item,
        resident_id,
        resident: formattedResident
    }
}


export const getVehicles = async (filters = {}) => {
    const query = { deleted: false }

    if (filters.resident_id) {
        query.resident_id = filters.resident_id
    }

    if (filters.vehicle_type) {
        query.vehicle_type = filters.vehicle_type
    }

    if (filters.license_plate) {
        query.license_plate = { $regex: filters.license_plate, $options: 'i' }
    }

    const vehicles = await Vehicle.find(query)
        .populate({
            path: 'resident_id',
            populate: [{ path: 'user_id' }, { path: 'apartment_id' }]
        })
        .sort({ created_at: -1 })
        .lean()

    return vehicles.map(transformVehicle)
}

export const getVehicleById = async (id) => {
    const vehicle = await Vehicle.findOne({ _id: id, deleted: false })
        .populate({
            path: 'resident_id',
            populate: [{ path: 'user_id' }, { path: 'apartment_id' }]
        })
        .lean()

    if (!vehicle) {
        abort(404, 'Vehicle not found')
    }

    return transformVehicle(vehicle)
}

export const createVehicle = async (data) => {
    const vehicle = await Vehicle.create(data)

    const populated = await Vehicle.findById(vehicle._id)
        .populate({
            path: 'resident_id',
            populate: [{ path: 'user_id' }, { path: 'apartment_id' }]
        })
        .lean()

    return transformVehicle(populated)
}


export const updateVehicle = async (id, data) => {
    const vehicle = await Vehicle.findOneAndUpdate(
        { _id: id, deleted: false },
        data,
        { new: true }
    )
        .populate({
            path: 'resident_id',
            populate: [{ path: 'user_id' }, { path: 'apartment_id' }]
        })
        .lean()

    if (!vehicle) {
        abort(404, 'Vehicle not found')
    }

    return transformVehicle(vehicle)
}


export const updateVehicleStatus = async (id, is_active) => {
    const vehicle = await Vehicle.findOneAndUpdate(
        { _id: id, deleted: false },
        { is_active },
        { new: true }
    )
        .populate({
            path: 'resident_id',
            populate: [{ path: 'user_id' }, { path: 'apartment_id' }]
        })
        .lean()

    if (!vehicle) {
        abort(404, 'Vehicle not found')
    }

    return transformVehicle(vehicle)
}


export const deleteVehicle = async (id) => {
    const vehicle = await Vehicle.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true },
        { new: true }
    )

    if (!vehicle) {
        abort(404, 'Vehicle not found')
    }

    return { message: 'Vehicle deleted successfully' }
}


export const getMyVehicles = async (userId) => {
    const resident = await Resident.findOne({ user_id: userId }).lean()

    if (!resident) {
        return []
    }

    const vehicles = await Vehicle.find({
        resident_id: resident._id,
        deleted: false
    })
        .populate({
            path: 'resident_id',
            populate: [{ path: 'user_id' }, { path: 'apartment_id' }]
        })
        .sort({ created_at: -1 })
        .lean()

    return vehicles.map(transformVehicle)
}
