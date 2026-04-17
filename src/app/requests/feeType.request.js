import Joi from 'joi'

export const createItem = Joi.object({
    name:Joi.string().trim().required().label('Tên phí dịch vụ'),
    fee_category:Joi.string().required().label('loại phí'),
    unit_price:Joi.number().integer().min(0).required().label('giá'),
    unit:Joi.string().trim().required().label('đơn vị'),
    description:Joi.string().trim().allow('').label('mô tả'),
    is_active:Joi.boolean().default(true).label('trạng thái hoạt động')
})

export const updateItem = Joi.object({
    name:Joi.string().trim().required().label('Tên phí dịch vụ'),
    fee_category:Joi.string().required().label('loại phí'),
    unit_price:Joi.number().integer().min(0).required().label('giá'),
    unit:Joi.string().trim().required().label('đơn vị'),
    description:Joi.string().trim().allow('').label('mô tả'),
    is_active:Joi.boolean().default(true).label('trạng thái hoạt động')
})