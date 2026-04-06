import { Floor, Building, Apartment } from '@/models'
import { abort } from '@/utils/helpers'

export const getFloor = async () => {
    const res = await Floor.find().populate('building_id').lean()
    if (!res) {
        abort(404, 'Floor not found')
    }
    return res.map(floor => {
        floor.building = floor.building_id
        floor.building_id = floor.building ? floor.building._id : null
        return floor
    })
}

export const createFloor = async (data) => {
    if (!data.building_id) {
        abort(400, 'chuyền building_id vào')
    }
    const buildingExists = await Building.findById(data.building_id)
    if (!buildingExists) {
        abort(404, 'building_id not found')
    }
    const existingFloor = await Floor.findOne({ floor_number: data.floor_number, building_id: data.building_id })
    if (existingFloor) {
        abort(400, 'Floor already exists')
    }

    const lastFloor = await Floor.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
    const nextId = lastFloor ? (parseInt(lastFloor.id) + 1).toString().padStart(3, '0') : '001'
    data.id = nextId

    const res = await Floor.create(data)
    if (!res) {
        abort(400, 'Create floor failed')
    }

    await Building.findByIdAndUpdate(data.building_id, {
        $max: { total_floors: data.floor_number }
    })

    const populated = await Floor.findById(res._id).populate('building_id').lean()
    populated.building = populated.building_id
    populated.building_id = populated.building ? populated.building._id : null

    return populated
}

export const getByIdFloor = async (id) => {
    const res = await Floor.findById(id).populate('building_id').lean()
    if (!res) {
        abort(404, 'Floor not found')
    }

    res.building = res.building_id
    res.building_id = res.building ? res.building._id : null

    return res
}

export const updateFloor = async (id, data) => {
    const res = await Floor.findByIdAndUpdate(id, data, { new: true })
        .populate('building_id')
    if (!res) {
        abort(404, 'Floor not found')
    }

    res.building = res.building_id
    res.building_id = res.building ? res.building._id : null

    return res
}

export const deleteFloor = async (id) => {
    await Apartment.deleteMany({ floor_id: id })
    const res = await Floor.findByIdAndDelete(id)
    if (!res) {
        abort(404, 'Floor not found')
    }
    return res
}

export const getLayoutFloor = async (id) => {
    const floor = await Floor.findById(id).lean()
    if (!floor) {
        abort(404, 'Floor not found')
    }

    const apartments = await Apartment.find({ floor_id: id })
        .select('apartment_code status area num_bedrooms num_bathrooms')
        .sort({ apartment_code: 1 })
        .lean()

    return {
        floor,
        apartments
    }
}
