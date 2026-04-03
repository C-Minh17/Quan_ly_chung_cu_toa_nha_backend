import { Apartment, Floor, Resident, Building } from '@/models'
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
    if (!data.building_id || !data.floor_id) {
        abort(400, 'Phải truyền building_id và floor_id')
    }
    const [buildingExists, floorExists] = await Promise.all([
        Building.findById(data.building_id),
        Floor.findById(data.floor_id)
    ])
    if (!buildingExists) abort(404, 'building_id not found')
    if (!floorExists) abort(404, 'floor_id not found')

    if (floorExists.building_id.toString() !== data.building_id) {
        abort(400, 'Floor is not part of this building')
    }

    if (!data.apartment_code) {
        const lastApartment = await Apartment.findOne({ floor_id: data.floor_id })
            .sort({ apartment_code: -1 })
            .lean()

        if (lastApartment) {
            const lastCodeSuffix = parseInt(lastApartment.apartment_code.slice(-2))
            data.apartment_code = `${floorExists.floor_number}${String(lastCodeSuffix + 1).padStart(2, '0')}`
        } else {
            data.apartment_code = `${floorExists.floor_number}01`
        }
    }

    try {
        const res = await Apartment.create(data)
        const populated = await Apartment.findById(res._id)
            .populate({
                path: 'floor_id',
                populate: { path: 'building_id' }
            })
            .lean()

        if (populated) {
            populated.floor = populated.floor_id
            if (populated.floor) {
                populated.floor.building = populated.floor.building_id
                delete populated.floor.building_id
            }
            delete populated.floor_id
        }
        return populated
    } catch (error) {
        if (error.code === 11000) {
            abort(400, 'Mã căn hộ này đã tồn tại trong tòa nhà này')
        }
        throw error
    }
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

export const getApartmentHistory = async (apartmentId) => {
    const history = await Resident.find({ apartment_id: apartmentId })
        .populate('user_id')
        .sort({ move_in_date: -1 })
        .lean()

    return history
}