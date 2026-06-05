import * as residentDashboardService from '@/app/services/residentDashboard.service'

export const getMetrics = async (req, res) => {
    const data = await residentDashboardService.getDashboardMetrics(req.currentUser._id)
    return res.status(200).json({
        success: true,
        data
    })
}

export const getBills = async (req, res) => {
    const data = await residentDashboardService.getCurrentBills(req.currentUser._id)
    return res.status(200).json({
        success: true,
        data
    })
}

export const getBookings = async (req, res) => {
    const data = await residentDashboardService.getUpcomingBookings(req.currentUser._id)
    return res.status(200).json({
        success: true,
        data
    })
}

export const getMaintenance = async (req, res) => {
    const data = await residentDashboardService.getMaintenanceRequests(req.currentUser._id)
    return res.status(200).json({
        success: true,
        data
    })
}
