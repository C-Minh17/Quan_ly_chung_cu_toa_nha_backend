import * as dashboardService from '@/app/services/dashboard.service'

export const getDashboardMetricsController = async (req, res) => {
    try {
        const data = await dashboardService.getDashboardMetrics()
        return res.status(200).json({
            success: true,
            data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Lấy metrics dashboard thất bại',
            error: err.message
        })
    }
}

export const getRecentActivitiesController = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10
        const data = await dashboardService.getRecentActivities({ limit })
        return res.status(200).json({
            success: true,
            data
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Lấy nhật ký hoạt động thất bại',
            error: err.message
        })
    }
}
