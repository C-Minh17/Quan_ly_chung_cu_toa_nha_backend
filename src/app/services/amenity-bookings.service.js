import { AmenityBooking, Amenities, Resident } from '@/models'
import { abort } from '@/utils/helpers'

export const getAllAmenityBookings = async () => {
    const res = await AmenityBooking.find().populate('amenity_id').populate('resident_id').lean()
    if (!res) {
        abort(404, 'Get Amenity Bookings failed')
    }
    return res.map(booking => {
        booking.amenity = booking.amenity_id
        booking.amenity_id = booking.amenity ? booking.amenity._id : null
        booking.resident = booking.resident_id
        booking.resident_id = booking.resident ? booking.resident._id : null
        return booking
    })
}

export const getByIdAmenityBookings = async (id) => {
    const res = await AmenityBooking.findById(id).populate('amenity_id').populate('resident_id').lean()
    if (!res) {
        abort(404, 'Get Amenity Bookings failed')
    }
    res.amenity = res.amenity_id
    res.amenity_id = res.amenity ? res.amenity._id : null
    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null
    return res
}

export const createAmenityBookings = async (data) => {
    if (!data.amenity_id || !data.resident_id) {
        abort(400, 'truyền amenity_id và resident_id')
    }
    const [amenityExists, residentExists] = await Promise.all([
        Amenities.findById(data.amenity_id),
        Resident.findById(data.resident_id)
    ])
    if (!amenityExists) abort(404, 'amenity_id not found')
    if (!residentExists) abort(404, 'resident_id not found')
    if (amenityExists.is_active === false) {
        abort(400, 'amenity is not active')
    }

    if (!data.amenities_code) {
        const lastAmenitiesBooking = await AmenityBooking.findOne()
            .sort({ amenities_code: -1 })
            .lean()
        if (lastAmenitiesBooking) {
            const lastCodeSuffix = parseInt(lastAmenitiesBooking.amenities_code.replace(/[^0-9]/g, '')) || 0
            data.amenities_code = `B${String(lastCodeSuffix + 1).padStart(2, '0')}`
        } else {
            data.amenities_code = 'B01'
        }
    }

    const lastAmenitiesBooking = await AmenityBooking.findOne().collation({ locale: 'en_US', numericOrdering: true }).sort({ id: -1 })
    const nextId = lastAmenitiesBooking ? (parseInt(lastAmenitiesBooking.id) + 1).toString().padStart(3, '0') : '001'
    data.id = nextId
    const res = await AmenityBooking.create(data)
    if (!res) {
        abort(400, 'Create Amenity Bookings failed')
    }
    return res

}

export const updateApproveAmenityBookings = async (data) => {
    const res = await AmenityBooking.findByIdAndUpdate(
        data.id,
        { status: 'approved' },
        { new: true }
    )
        .populate('amenity_id')
        .populate('resident_id')
        .lean()
    if (!res) {
        abort(404, 'Approve Amenity Booking failed')
    }
    res.amenity = res.amenity_id
    res.amenity_id = res.amenity ? res.amenity._id : null
    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null
    return res
}

export const updateRejectAmenityBookings = async (data) => {
    const res = await AmenityBooking.findByIdAndUpdate(
        data.id,
        { status: 'rejected' },
        { new: true }
    )
        .populate('amenity_id')
        .populate('resident_id')
        .lean()
    if (!res) {
        abort(404, 'Reject Amenity Booking failed')
    }
    res.amenity = res.amenity_id
    res.amenity_id = res.amenity ? res.amenity._id : null
    res.resident = res.resident_id
    res.resident_id = res.resident ? res.resident._id : null
    return res
}

export const deleteAmenityBookings = async (id) => {
    const res = await AmenityBooking.findByIdAndDelete(id).lean()
    if (!res) {
        abort(404, 'Delete Amenity Booking failed')
    }
    return res
}

export const getMyAmenityBookings = async (userId) => {
    const residents = await Resident.find({ user_id: userId }).select('_id')
    const residentIds = residents.map(r => r._id)

    const res = await AmenityBooking.find({ resident_id: { $in: residentIds } })
        .populate('amenity_id')
        .populate('resident_id')
        .lean()

    return res.map(booking => {
        booking.amenity = booking.amenity_id
        booking.amenity_id = booking.amenity ? booking.amenity._id : null
        booking.resident = booking.resident_id
        booking.resident_id = booking.resident ? booking.resident._id : null
        return booking
    })
}
