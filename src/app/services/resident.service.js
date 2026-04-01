import { Resident } from '@/models'
import { abort } from '@/utils/helpers'

const saveImageField = async (field) => {
    if (field && typeof field.save === 'function') {
        return await field.save('residents', 'id-card')
    }
    return field
}

const prepareResidentData = async (data) => {
    const residentData = { ...data }

    if (residentData.id_card_front_image) {
        residentData.id_card_front_image = await saveImageField(residentData.id_card_front_image)
    }
    if (residentData.id_card_back_image) {
        residentData.id_card_back_image = await saveImageField(residentData.id_card_back_image)
    }

    return residentData
}

export const getResident = async () => {
    const res = await Resident.find().populate(['user_id', 'apartment_id']).lean()
    if(!res) {
        abort(404, 'Resident not found')
    }

    return res.map(item => {
        return {
            ...item,
            user: item.user_id,
            apartment: item.apartment_id
        }
    })
}

export const getResidentById = async (id) => {
    const res = await Resident.findById(id).populate(['user_id', 'apartment_id']).lean()
    if(!res) {
        abort(404, 'Resident not found')
    }

    res.user = res.user_id
    res.apartment = res.apartment_id

    return res
}

export const createResident = async (data) => {
    const residentData = await prepareResidentData(data)
    const res = await Resident.create(residentData)
    if(!res) {
        abort(500, 'Error creating resident')
    }
    
    const populated = await Resident.findById(res._id).populate(['user_id', 'apartment_id']).lean()
    populated.user = populated.user_id
    populated.apartment = populated.apartment_id

    return populated
}

export const updateResident = async (id, data) => {
    const residentData = await prepareResidentData(data)

    const res = await Resident.findByIdAndUpdate(id, residentData, { new: true }).populate(['user_id', 'apartment_id']).lean()
    if(!res) {
        abort(404, 'Resident not found')
    }

    res.user = res.user_id
    res.apartment = res.apartment_id

    return res
}

export const deleteResident = async (id) => {
    const res = await Resident.findByIdAndDelete(id)
    if(!res) {
        abort(404, 'Resident not found')
    }
    return res
}