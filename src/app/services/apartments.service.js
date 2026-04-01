import { Apartment, Floor } from '@/models'
import { abort } from '@/utils/helpers'

export const getApartment = async () => {
    const res = await Apartment.find().populate('floor_id').lean()
    if (!res) {
        abort(404, 'Apartment not found')
    }
    res.floor = res.floor_id
    delete res.floor_id
    return res
}

export const createApartment = async (data) => {
    if (!data.floor_id) {
        abort(400, 'chuyền floor_id vào')
    }
    const floorExists = await Floor.findById(data.floor_id)
    if (!floorExists) {
        abort(404, 'floor_id not found')
    }
    if (!data.apartment_code) {
        const count = await Apartment.countDocuments({ floor_id: data.floor_id })
        data.apartment_code = `${floorExists.floor_number}${String(count + 1).padStart(2, '0')}`
    }

    const res = await Apartment.create(data)
    if (!res) {
        abort(400, 'Create apartment failed')
    }

    const populated = await Apartment.findById(res._id).populate('floor_id').lean()
    populated.floor = populated.floor_id
    delete populated.floor_id

    return populated
}

export const getByIdApartment = async (id) => {
    const res = await Apartment.findById(id).populate('floor_id').lean()
    if (!res) {
        abort(404, 'Apartment not found')
    }
    res.floor = res.floor_id
    delete res.floor_id
    return res
}

export const updateApartment = async (id, data) => {
    const res = await Apartment.findByIdAndUpdate(id, data, { new: true })
        .populate('floor_id')
    if (!res) {
        abort(404, 'Update apartment failed')
    }

    res.floor = res.floor_id
    delete res.floor_id
    return res
}

export const updateStatusApartment = async (id, status) => {
    const res = await Apartment.findByIdAndUpdate(id, { status }, { new: true })
        .populate('floor_id')
    if (!res) {
        abort(404, 'Apartment not found')
    }

    res.floor = res.floor_id
    delete res.floor_id
    return res
}

export const deleteApartment = async (id) => {
    const res = await Apartment.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'Delete apartment failed')
    }
    return res
}