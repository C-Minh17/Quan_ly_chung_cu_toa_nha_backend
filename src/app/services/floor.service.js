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

    const lastFloorInBuilding = await Floor.findOne({ building_id: data.building_id }).sort({ floor_number: -1 })
    const nextFloorNumber = (lastFloorInBuilding && lastFloorInBuilding.floor_number) ? lastFloorInBuilding.floor_number + 1 : 1

    if (buildingExists.total_floors && nextFloorNumber > buildingExists.total_floors) {
        abort(400, `Không thể tạo thêm tầng. Tòa nhà chỉ có tối đa ${buildingExists.total_floors} tầng.`)
    }

    data.floor_number = nextFloorNumber

    const existingFloor = await Floor.findOne({ floor_number: data.floor_number, building_id: data.building_id })
    if (existingFloor) {
        abort(400, 'Floor already exists')
    }


    const buildingPrefix = buildingExists.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')

    const lastFloor = await Floor.findOne({
        building_id: data.building_id
    })
       
        .sort({ id: -1 })
        .lean()

    let nextNumber = 1

    if (lastFloor?.id) {
        const numberPart = lastFloor.id.slice(buildingPrefix.length)
        nextNumber = Number(numberPart, 10) + 1
    }

    data.id = `${buildingPrefix}${String(nextNumber).padStart(3, '0')}`

    const res = await Floor.create(data)
    if (!res) {
        abort(400, 'Create floor failed')
    }

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
