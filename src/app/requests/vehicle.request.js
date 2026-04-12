import Joi from 'joi'

const objectId = Joi.string().hex().length(24)


export const createItem = Joi.object({
    resident_id: objectId.required().label('ID cư dân'),
    license_plate: Joi.string().trim().required().label('Biển số xe'),
    vehicle_type: Joi.string().valid('motorbike', 'car', 'bicycle').required().label('Loại xe'),
    brand: Joi.string().trim().optional().allow('').label('Nhãn hiệu'),
    color: Joi.string().trim().optional().allow('').label('Màu sắc'),
    card_number: Joi.string().trim().optional().allow('').label('Số thẻ từ'),
    is_active: Joi.boolean().default(true).label('Trạng thái hoạt động'),
}).unknown(true)

export const updateItem = Joi.object({
    resident_id: objectId.optional().label('ID cư dân'),
    license_plate: Joi.string().trim().optional().label('Biển số xe'),
    vehicle_type: Joi.string().valid('motorbike', 'car', 'bicycle').optional().label('Loại xe'),
    brand: Joi.string().trim().optional().allow('').label('Nhãn hiệu'),
    color: Joi.string().trim().optional().allow('').label('Màu sắc'),
    card_number: Joi.string().trim().optional().allow('').label('Số thẻ từ'),
    is_active: Joi.boolean().optional().label('Trạng thái hoạt động'),
}).unknown(true)
