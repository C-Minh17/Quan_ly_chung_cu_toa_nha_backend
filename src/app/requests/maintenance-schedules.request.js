import Joi from 'joi'

export const createItem = Joi.object({
    Maintenance_Schedules_id: Joi.string().trim().optional().label('Mã lịch bảo trì'),
    id: Joi.string().trim().optional().label('ID'),
    title: Joi.string().trim().required().label('Tiêu đề'),
    description: Joi.string().trim().required().label('Mô tả'),
    frequency: Joi.string().valid('once', 'weekly', 'monthly', 'quarterly', 'yearly', 'none').optional().label('Tần suất'),
    scheduled_date: Joi.date().optional().label('Ngày dự kiến'),
    assigned_to: Joi.string().hex().length(24).required().label('Người phụ trách'),
    status: Joi.string().valid('scheduled', 'completed', 'cancelled').optional().label('Trạng thái')
})

export const updateItem = Joi.object({
    Maintenance_Schedules_id: Joi.string().trim().optional().label('Mã lịch bảo trì'),
    id: Joi.string().trim().optional().label('ID'),
    title: Joi.string().trim().optional().label('Tiêu đề'),
    description: Joi.string().trim().optional().label('Mô tả'),
    frequency: Joi.string().valid('once', 'weekly', 'monthly', 'quarterly', 'yearly', 'none').optional().label('Tần suất'),
    scheduled_date: Joi.date().optional().label('Ngày dự kiến'),
    assigned_to: Joi.string().hex().length(24).optional().label('Người phụ trách'),
    status: Joi.string().valid('scheduled', 'completed', 'cancelled').optional().label('Trạng thái')
})

export const completeItem = Joi.object({
    status: Joi.string().valid('completed', 'cancelled').required().label('Trạng thái hoàn thành/hủy')
})
