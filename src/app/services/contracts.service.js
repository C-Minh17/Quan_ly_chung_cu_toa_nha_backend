import { Contract, Apartment, Resident } from '@/models'
import { abort } from '@/utils/helpers'

const transformContract = (item) => {
    if (!item) return item

    const apartment = item.apartment_id
    const resident = item.resident_id
    const resident_user = resident?.user_id

    // Ensure _id fields are string IDs
    const apartment_id = apartment?._id ? apartment._id.toString() : (item.apartment_id?._id || item.apartment_id)
    const resident_id = resident?._id ? resident._id.toString() : (item.resident_id?._id || item.resident_id)

    // Inside the resident object, ensure user_id is a string ID if it was populated
    let formattedResident = resident
    if (resident && typeof resident === 'object') {
        formattedResident = {
            ...resident,
            user_id: resident_user?._id ? resident_user._id.toString() : (resident.user_id?._id || resident.user_id)
        }
    }

    return {
        ...item,
        apartment_id,
        resident_id,
        apartment,
        resident: formattedResident,
        resident_user: resident_user
    }
}

export const getContracts = async (filters = {}) => {
    const query = {}

    if (filters.status) {
        query.status = filters.status
    }

    if (filters.nearing_expiry_days) {
        const now = new Date()
        const future = new Date()
        future.setDate(now.getDate() + parseInt(filters.nearing_expiry_days))
        query.end_date = { $gte: now, $lte: future }
    }

    const contracts = await Contract.find(query)
        .populate([
            { path: 'apartment_id' },
            {
                path: 'resident_id',
                populate: { path: 'user_id' }
            }
        ])
        .sort({ created_at: -1 })
        .lean()

    return contracts.map(transformContract)
}


export const getContractById = async (id) => {
    const contract = await Contract.findById(id)
        .populate([
            { path: 'apartment_id' },
            {
                path: 'resident_id',
                populate: { path: 'user_id' }
            }
        ])
        .lean()

    if (!contract) {
        abort(404, 'Contract not found')
    }

    return transformContract(contract)
}


export const createContract = async (data) => {
    const activeContract = await Contract.findOne({
        apartment_id: data.apartment_id,
        status: 'active'
    })

    if (activeContract) {
        abort(400, 'This apartment already has an active contract')
    }

    const contract = await Contract.create(data)

    await Apartment.findByIdAndUpdate(data.apartment_id, {
        contract_number: data.contract_code,
        contract_start_date: data.start_date,
        contract_end_date: data.end_date,
        contract_status: 'active',
        contract_file: data.file_url || '',
        status: 'occupied'
    })

    const populated = await Contract.findById(contract._id)
        .populate(['apartment_id', 'resident_id'])
        .lean()

    return transformContract(populated)
}


export const updateContract = async (id, data) => {
    const contract = await Contract.findByIdAndUpdate(id, data, { new: true })
        .populate(['apartment_id', 'resident_id'])
        .lean()

    if (!contract) {
        abort(404, 'Contract not found')
    }

    if (contract.status === 'active' && (data.end_date || data.start_date || data.file_url)) {
        const updateFields = {}
        if (data.start_date) updateFields.contract_start_date = data.start_date
        if (data.end_date) updateFields.contract_end_date = data.end_date
        if (data.file_url) updateFields.contract_file = data.file_url

        await Apartment.findByIdAndUpdate(contract.apartment_id, updateFields)
    }

    return transformContract(contract)
}


export const terminateContract = async (id) => {
    const contract = await Contract.findById(id)
    if (!contract) {
        abort(404, 'Contract not found')
    }

    contract.status = 'terminated'
    await contract.save()

    await Apartment.findByIdAndUpdate(contract.apartment_id, {
        contract_status: 'none',
        contract_number: '',
        status: 'available'
    })

    await Resident.findByIdAndUpdate(contract.resident_id, {
        move_out_date: new Date()
    })

    return transformContract(contract.toObject())
}


export const getMyContracts = async (userId) => {
    const resident = await Resident.findOne({ user_id: userId }).lean()
    if (!resident) {
        return []
    }
    const contracts = await Contract.find({ resident_id: resident._id })
        .populate(['apartment_id'])
        .sort({ created_at: -1 })
        .lean()

    return contracts.map(transformContract)
}
