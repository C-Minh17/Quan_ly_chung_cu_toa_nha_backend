import { UtilityReading } from '@/models'
import { abort } from '@/utils/helpers'

const transformUtilityReading = (item) => {
    if (!item) return item
    const fee_type_id = item.fee_type_id?._id || item.fee_type_id
    const apartment_id = item.apartment_id?._id || item.apartment_id
    const recorded_by = item.recorded_by?._id || item.recorded_by

    const apartment = item.apartment_id
    if (apartment && typeof apartment === 'object') {
        const floor = apartment.floor_id
        if (floor && typeof floor === 'object') {
            floor.building = floor.building_id
            floor.building_id = floor.building?._id || floor.building_id
        }
        apartment.floor = floor
        apartment.floor_id = floor?._id || apartment.floor_id
    }

    return {
        ...item,
        recorded_by,
        recorder: item.recorded_by,
        fee_type_id,
        fee_type: item.fee_type_id,
        apartment_id,
        apartment: apartment
    }
}

const calcConsumption = (data) => {
    const prev = data.previous_reading
    const curr = data.current_reading

    if (prev !== null && prev !== void 0 && curr !== null && curr !== void 0) {
        if (curr < prev) {
            abort(400, 'Chỉ số hiện tại không được nhỏ hơn chỉ số trước')
        }
        data.consumption = curr - prev
    }

    return data
}

const getPreviousReading = async (apartment_id, fee_type_id, reading_month, reading_year) => {
    let prevMonth = reading_month - 1
    let prevYear = reading_year

    if (prevMonth === 0) {
        prevMonth = 12
        prevYear -= 1
    }

    const prev = await UtilityReading.findOne({
        apartment_id,
        fee_type_id,
        reading_month: prevMonth,
        reading_year: prevYear,
    }).lean()

    return prev?.current_reading ?? 0
}

export const getUtilityReading =async () => {
    const res = await UtilityReading.find().populate(['fee_type_id','recorded_by', { path: 'apartment_id', populate: { path: 'floor_id', populate: { path: 'building_id' } } }]).lean()
    if(!res){
        abort(404, 'UtilityReading not found')
    }
    return res.map(transformUtilityReading)
}

export const getUtilityReadingById =async (id) => {
    const res = await UtilityReading.findById(id).populate(['fee_type_id','recorded_by', { path: 'apartment_id', populate: { path: 'floor_id', populate: { path: 'building_id' } } }]).lean()
    if(!res){
        abort(404, 'UtilityReading not found')
    }
    return transformUtilityReading(res)
}

export const createUtilityReading = async (data) => {
    if (!data.previous_reading && data.previous_reading !== 0) {
        data.previous_reading = await getPreviousReading(
            data.apartment_id,
            data.fee_type_id,
            data.reading_month,
            data.reading_year
        )
    }
    const payload = calcConsumption({ ...data })
    const res = await UtilityReading.create(payload)
    if (!res) {
        abort(500, 'Error creating resident')
    }
    const populated = await UtilityReading.findById(res._id).populate(['fee_type_id','recorded_by', { path: 'apartment_id', populate: { path: 'floor_id', populate: { path: 'building_id' } } }]).lean()
    return transformUtilityReading(populated)
}

export const updateUtilityReading = async (id, data) => {
    const allowedFields = ['current_reading', 'previous_reading', 'recorded_by', 'recorded_at']
    const updateData = Object.fromEntries(
        Object.entries(data).filter(([key]) => allowedFields.includes(key))
    )

    if (
        'current_reading' in updateData ||
        'previous_reading' in updateData
    ) {
        const existing = await UtilityReading.findById(id).lean()
        if (!existing) abort(404, 'UtilityReading not found')

        updateData.previous_reading ??= existing.previous_reading
        updateData.current_reading  ??= existing.current_reading
        calcConsumption(updateData)
    }

    const res = await UtilityReading.findByIdAndUpdate(id, updateData, { new: true })
        .populate(['fee_type_id', 'recorded_by', { path: 'apartment_id', populate: { path: 'floor_id', populate: { path: 'building_id' } } }])
        .lean()
    if (!res) {
        abort(404, 'UtilityReading not found')
    }
    return transformUtilityReading(res)
}

export const deleteUtilityReading = async (id) => {
    const res = await UtilityReading.findByIdAndDelete(id)
    if(!res){
        abort(404, 'UtilityReading not found')
    }
    return res
}