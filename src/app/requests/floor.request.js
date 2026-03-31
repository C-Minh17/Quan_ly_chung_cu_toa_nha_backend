import Joi from 'joi'

export const createItem = Joi.object({
    name: Joi.string().trim().required().label('Tên tầng'),
    floor_number: Joi.number().integer().required().label('Số tầng'),
    building_id: Joi.string().hex().length(24).required().label('ID Tòa nhà'),
    description: Joi.string().trim().required().label('Mô tả'),
})

export const updateItem = Joi.object({
    name: Joi.string().trim().required().label('Tên tầng'),
    floor_number: Joi.number().integer().required().label('Số tầng'),
    building_id: Joi.string().hex().length(24).required().label('ID Tòa nhà'),
    description: Joi.string().trim().required().label('Mô tả'),
})
