import { Resident } from '@/models'
import { abort } from '@/utils/helpers'

const transformResident = (item) => {
    if (!item) return item
    const user_id = item.user_id?._id || item.user_id
    const apartment_id = item.apartment_id?._id || item.apartment_id

    return {
        ...item,
        user_id,
        user: item.user_id,
        apartment_id,
        apartment: item.apartment_id
    }
}

export const getResident = async () => {
    const res = await Resident.find().populate(['user_id', 'apartment_id']).lean()
    if (!res) {
        abort(404, 'Resident not found')
    }

    return res.map(transformResident)
}

export const getResidentById = async (id) => {
    const res = await Resident.findById(id).populate(['user_id', 'apartment_id']).lean()
    if (!res) {
        abort(404, 'Resident not found')
    }

    return transformResident(res)
}

export const createResident = async (data) => {
    const res = await Resident.create(data)
    if (!res) {
        abort(500, 'Error creating resident')
    }

    const populated = await Resident.findById(res._id).populate(['user_id', 'apartment_id']).lean()
    return transformResident(populated)
}

export const updateResident = async (id, data) => {
    const res = await Resident.findByIdAndUpdate(id, data, { new: true }).populate(['user_id', 'apartment_id']).lean()
    if (!res) {
        abort(404, 'Resident not found')
    }

    return transformResident(res)
}

export const deleteResident = async (id) => {
    const res = await Resident.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'Resident not found')
    }
    return res
}