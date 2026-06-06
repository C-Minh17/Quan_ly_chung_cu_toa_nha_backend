import { Apartment, Floor, Resident, Building } from '@/models'
import { abort } from '@/utils/helpers'

export const getApartment = async () => {
    const res = await Apartment.find().populate('floor_id').lean()
    if (!res) {
        abort(404, 'Apartment not found')
    }
    return res.map(apartment => {
        apartment.floor = apartment.floor_id
        apartment.floor_id = apartment.floor ? apartment.floor._id : null
        apartment.building_id = apartment.floor ? apartment.floor.building_id : null
        return apartment
    })
}

export const createApartment = async (data) => {

    await Apartment.syncIndexes()
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
        const floorsInBuilding = await Floor.find({ building_id: data.building_id }).select('_id').lean()
        const floorIds = floorsInBuilding.map(f => f._id)
        const lastApartmentInBuilding = await Apartment.findOne({
            floor_id: { $in: floorIds },
            apartment_code: new RegExp(`^${floorExists.floor_number}\\d{2}$`)
        })
            .sort({ apartment_code: -1 })
            .lean()

        if (lastApartmentInBuilding) {
            const lastCodeSuffix = parseInt(lastApartmentInBuilding.apartment_code.slice(-2))
            data.apartment_code = `${floorExists.floor_number}${String(lastCodeSuffix + 1).padStart(2, '0')}`
        } else {
            data.apartment_code = `${floorExists.floor_number}01`
        }
    }

    const lastApartment = await Apartment.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
    const nextId = lastApartment && lastApartment.id ? (parseInt(lastApartment.id) + 1).toString().padStart(3, '0') : '001'
    data.id = nextId

    try {
        const res = await Apartment.create(data)
        const populated = await Apartment.findById(res._id)
            .populate({
                path: 'floor_id',
                populate: { path: 'building_id' }
            })
            .lean()

        if (populated) {
            populated.building_id = data.building_id
            populated.floor = populated.floor_id
            if (populated.floor) {
                populated.floor.building = populated.floor.building_id
                populated.floor.building_id = populated.floor.building ? populated.floor.building._id : null
            }
            populated.floor_id = populated.floor ? populated.floor._id : null
        }
        return populated
    } catch (error) {
        if (error.code === 11000) {
            console.log('=== LỖI MONGODB E11000 ===')
            console.log('Trường bị trùng:', error.keyValue)
            if (error.keyPattern && error.keyPattern.id) {
                abort(400, `Lỗi hệ thống: ID ${error.keyValue.id} đã tồn tại! Hãy kiểm tra lại logic sinh ID.`)
            }
            if (error.keyPattern && error.keyPattern.apartment_code) {
                abort(400, `Mã căn hộ ${error.keyValue.apartment_code} đã tồn tại trong tòa nhà này!`)
            }

            abort(400, 'Dữ liệu bị trùng lặp (Duplicate Key)')
        }
        throw error
    }
}

export const getByIdApartment = async (id) => {
    const res = await Apartment.findById(id).populate('floor_id').lean()
    if (!res) {
        abort(404, 'Apartment not found')
    }
    res.building_id = res.floor ? res.floor.building_id : null
    res.floor = res.floor_id
    res.floor_id = res.floor ? res.floor._id : null
    return res
}

export const updateApartment = async (id, data) => {
    const res = await Apartment.findByIdAndUpdate(id, data, { new: true })
        .populate('floor_id')
    if (!res) {
        abort(404, 'Update apartment failed')
    }

    res.building_id = res.floor ? res.floor.building_id : null
    res.floor = res.floor_id
    res.floor_id = res.floor ? res.floor._id : null
    return res
}

export const updateStatusApartment = async (id, status) => {
    const res = await Apartment.findByIdAndUpdate(id, { status }, { new: true })
        .populate('floor_id')
    if (!res) {
        abort(404, 'Apartment not found')
    }

    res.building_id = res.floor ? res.floor.building_id : null
    res.floor = res.floor_id
    res.floor_id = res.floor ? res.floor._id : null
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