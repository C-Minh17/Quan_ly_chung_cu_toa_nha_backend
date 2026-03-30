import Joi from 'joi'

export const createItem = Joi.object({
    name: Joi.string().trim().required().label('Tên tòa nhà'),
    address: Joi.string().trim().required().label('Địa chỉ'),
    total_floors: Joi.number().integer().min(1).required().label('Tổng số tầng'),
    description: Joi.string().trim().required().label('Mô tả'),
})

export const updateItem = Joi.object({
    name: Joi.string().trim().required().label('Tên tòa nhà'),
    address: Joi.string().trim().required().label('Địa chỉ'),
    total_floors: Joi.number().integer().min(1).required().label('Tổng số tầng'),
    description: Joi.string().trim().required().label('Mô tả'),
})
