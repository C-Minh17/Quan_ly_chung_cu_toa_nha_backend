import * as ContractService from '../services/contracts.service'

export const getContractsController = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            nearing_expiry_days: req.query.nearing_expiry_days
        }
        const data = await ContractService.getContracts(filters)
        return res.status(200).json({
            success: true,
            message: 'Get contracts successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get contracts failed',
            error: err.message
        })
    }
}

export const getContractByIdController = async (req, res) => {
    try {
        const data = await ContractService.getContractById(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Get contract successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Get contract failed',
            error: err.message
        })
    }
}

export const createContractController = async (req, res) => {
    try {
        const data = req.body
        const createData = await ContractService.createContract(data)
        return res.status(200).json({
            success: true,
            message: 'Create contract successfully',
            data: createData
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Create contract failed',
            error: err.message
        })
    }
}

export const updateContractController = async (req, res) => {
    try {
        const data = req.body
        const updateData = await ContractService.updateContract(req.params.id, data)
        return res.status(200).json({
            success: true,
            message: 'Update contract successfully',
            data: updateData
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Update contract failed',
            error: err.message
        })
    }
}

export const terminateContractController = async (req, res) => {
    try {
        const data = await ContractService.terminateContract(req.params.id)
        return res.status(200).json({
            success: true,
            message: 'Terminate contract successfully',
            data: data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: 'Terminate contract failed',
            error: err.message
        })
    }
}


export const getMyContractsController = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        const data = await ContractService.getMyContracts(userId)
        return res.status(200).json({
            success: true,
            message: 'Get my contracts successfully',
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Get my contracts failed',
            error: err.message
        })
    }
}
