import Joi from 'joi'

export const createItem = Joi.object({
    Maintenance_Requests_code: Joi.string().trim().label('Mã sửa chữa'),
    apartment_id: Joi.string().hex().length(24).required().label('ID Căn Hộ'),
    resident_id: Joi.string().hex().length(24).required().label('ID Cư Dân'),
    title: Joi.string().trim().required().label('Tiêu đề'),
    description: Joi.string().trim().optional().allow('').label('Miêu tả'),
    category: Joi.string().trim().required().label('loại'),
    priority: Joi.string().trim().required().label('Ưu tiên'),
    status: Joi.string().trim().required().label('Trạng thái'),
    assigned_to: Joi.string().hex().length(24).optional().label('Người phụ trách'),
    rating: Joi.number().min(0).optional().label('Đánh giá'),
    feedback: Joi.string().trim().optional().allow('').label('Nhận xét')
})

export const assignItem = Joi.object({
    assigned_to: Joi.string().hex().length(24).required().label('Người phụ trách'),
    priority: Joi.string().trim().required().label('Mức độ ưu tiên')
})

export const updateItem = Joi.object({
    Maintenance_Requests_code: Joi.string().trim().label('Mã sửa chữa'),
    apartment_id: Joi.string().hex().length(24).label('ID Căn Hộ'),
    resident_id: Joi.string().hex().length(24).label('ID Cư Dân'),
    title: Joi.string().trim().label('Tiêu đề'),
    description: Joi.string().trim().label('Miêu tả'),
    category: Joi.string().trim().label('loại'),
    priority: Joi.string().trim().label('Ưu tiên'),
    status: Joi.string().trim().label('Trạng thái'),
    assigned_to: Joi.string().hex().length(24).label('Người phụ trách'),
    rating: Joi.number().min(0).label('Đánh giá'),
    feedback: Joi.string().trim().label('Nhận xét')
})

export const updateStatusItem = Joi.object({
    status: Joi.string().trim().required().label('Trạng thái')
})

export const closeItem = Joi.object({})

export const rateItem = Joi.object({
    rating: Joi.number().min(1).max(5).required().label('Đánh giá'),
    feedback: Joi.string().trim().optional().allow('').label('Nhận xét')
})