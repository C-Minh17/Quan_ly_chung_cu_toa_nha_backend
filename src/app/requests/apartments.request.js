import Joi from 'joi'

export const createItem = Joi.object({
    apartment_code: Joi.string().trim().required().label('Mã căn hộ'),
    floor_id: Joi.string().hex().length(24).required().label('ID Tầng'),
    area: Joi.number().required().label('Diện tích'),
    num_bedrooms: Joi.number().integer().min(0).required().label('Số phòng ngủ'),
    num_bathrooms: Joi.number().integer().min(0).required().label('Số phòng tắm'),
    apartment_type: Joi.string().trim().required().label('Loại căn hộ'),
    status: Joi.string().trim().required().label('Trạng thái'),
    price: Joi.number().min(0).required().label('Giá'),
})

export const updateItem = Joi.object({
    apartment_code: Joi.string().trim().label('Mã căn hộ'),
    floor_id: Joi.string().hex().length(24).label('ID Tầng'),
    area: Joi.number().label('Diện tích'),
    num_bedrooms: Joi.number().integer().min(0).label('Số phòng ngủ'),
    num_bathrooms: Joi.number().integer().min(0).label('Số phòng tắm'),
    apartment_type: Joi.string().trim().label('Loại căn hộ'),
    status: Joi.string().trim().label('Trạng thái'),
    price: Joi.number().min(0).label('Giá'),
})
