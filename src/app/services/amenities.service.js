import { Amenities, AmenityBooking } from '@/models'
import { abort } from '@/utils/helpers'

export const getAmenities = async () => {
    const res = await Amenities.find().lean()
    if (!res) {
        abort(404, ' Get Amenties failed')
    }
    return res
}

export const getByIdAmenities = async (id) => {
    const res = await Amenities.findById(id).lean()
    if (!res) {
        abort(404, ' Get Amenties failed')
    }
    return res
}

export const createAmenities = async (data) => {
    if (!data.name || !data.description || (!data.capacity && !data.capcity)) {
        abort(404, ' Create Amenties failed')
    }
    if (!data.amenities_code) {
        const lastAmenities = await Amenities.findOne()
            .sort({ amenities_code: -1 })
            .lean()

        if (lastAmenities && lastAmenities.amenities_code) {
            const lastCodeSuffix = parseInt(lastAmenities.amenities_code.replace(/[^0-9]/g, '')) || 0
            data.amenities_code = `A${String(lastCodeSuffix + 1).padStart(2, '0')}`
        } else {
            data.amenities_code = 'A01'
        }
    }

    const lastAmenities = await Amenities.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
    const nextId = lastAmenities ? (parseInt(lastAmenities.id) + 1).toString().padStart(3, '0') : '001'
    data.id = nextId

    const res = await Amenities.create(data)
    if (!res) {
        abort(400, 'Create Amenities failed')
    }
    return res
}

export const updateAmenities = async (id, data) => {
    const res = await Amenities.findByIdAndUpdate(id, data, { new: true }).lean()
    if (!res) {
        abort(404, 'Update Amenities failed')
    }
    return res
}

export const updateStatusAmenities = async (id, is_active) => {
    if (typeof is_active !== 'boolean') {
        abort(400, 'is_active must be a boolean (true or false)')
    }
    const res = await Amenities.findByIdAndUpdate(id, { is_active }, { new: true }).lean()
    if (!res) {
        abort(404, 'update status amenities failed')
    }
    return res
}

export const deleteAmenities = async (id) => {
    const res = await Amenities.findByIdAndDelete(id).lean()
    if (!res) {
        abort(404, 'delete amenities failed')
    }
    return res
}

export const getAmenitiesSchedule = async (id, query = {}) => {
    const filter = {
        amenity_id: id,
        status: { $in: ['approved', 'pending'] }
    }

    if (query.date) {
        const startOfDay = new Date(query.date)
        startOfDay.setUTCHours(0, 0, 0, 0)
        const endOfDay = new Date(query.date)
        endOfDay.setUTCHours(23, 59, 59, 999)

        filter.booking_date = {
            $gte: startOfDay,
            $lte: endOfDay
        }
    }

    const res = await AmenityBooking.find(filter)
        .populate('amenity_id')
        .populate('resident_id')
        .sort({ start_time: 1 })
        .lean()

    return res.map(booking => {
        booking.amenity = booking.amenity_id
        booking.amenity_id = booking.amenity ? booking.amenity._id : null
        booking.resident = booking.resident_id
        booking.resident_id = booking.resident ? booking.resident._id : null
        return booking
    })
}