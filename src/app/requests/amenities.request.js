import Joi from 'joi'

export const createItem = Joi.object({
    amenities_code: Joi.string().trim().optional().label('Mã tiện ích'),
    name: Joi.string().trim().required().label('Tên tiện ích'),
    id: Joi.string().trim().optional().label('ID'),
    description: Joi.string().trim().required().label('Mô tả'),
    capacity: Joi.number().min(0).optional().label('Sức chứa'),
    open_time: Joi.date().optional().label('Giờ mở cửa'),
    close_time: Joi.date().optional().label('Giờ đóng cửa'),
    is_active: Joi.boolean().optional().label('Trạng thái hoạt động')
})

export const updateItem = Joi.object({
    amenities_code: Joi.string().trim().optional().label('Mã tiện ích'),
    name: Joi.string().trim().optional().label('Tên tiện ích'),
    id: Joi.string().trim().optional().label('ID'),
    description: Joi.string().trim().optional().label('Mô tả'),
    capacity: Joi.number().min(0).optional().label('Sức chứa'),
    open_time: Joi.date().optional().label('Giờ mở cửa'),
    close_time: Joi.date().optional().label('Giờ đóng cửa'),
    is_active: Joi.boolean().optional().label('Trạng thái hoạt động')
})

export const updateStatusItem = Joi.object({
    is_active: Joi.boolean().required().label('Trạng thái hoạt động')
})
