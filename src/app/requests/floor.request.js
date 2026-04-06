import Joi from 'joi'

export const createItem = Joi.object({
    floor_number: Joi.number().integer().allow(null, '').optional().label('Số tầng'),
    building_id: Joi.string().hex().length(24).required().label('ID Tòa nhà'),
    description: Joi.string().trim().allow('').optional().label('Mô tả'),
})

export const updateItem = Joi.object({
    floor_number: Joi.number().integer().allow(null, '').optional().label('Số tầng'),
    building_id: Joi.string().hex().length(24).required().label('ID Tòa nhà'),
    description: Joi.string().trim().allow('').optional().label('Mô tả'),
})
