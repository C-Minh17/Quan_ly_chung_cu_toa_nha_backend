import * as staffDashboardService from '@/app/services/staffDashboard.service'

export const getMetrics = async (req, res) => {
    try {
        const data = await staffDashboardService.getDashboardMetrics(req.currentUser)
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

export const getTasks = async (req, res) => {
    try {
        const data = await staffDashboardService.getDailyChecklist(req.currentUser)
        return res.status(200).json({
            success: true,
            data
        })
    } catch (err) {
        return res.status(200).json({
            success: false,
            message: err.message || 'Lấy danh sách công việc thất bại',
            error: err.message
        })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { completed } = req.body
        await staffDashboardService.toggleTaskStatus(req.params.id, completed)
        return res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái công việc thành công'
        })
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Cập nhật trạng thái công việc thất bại',
            error: err.message
        })
    }
}

export const getRecentLogs = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5
        const data = await staffDashboardService.getRecentLogs({ limit })
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
