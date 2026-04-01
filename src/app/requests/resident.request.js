import Joi from 'joi'

const objectId = Joi.string().hex().length(24)

export const createItem = Joi.object({
    user_id: objectId.optional().allow('', null).label('ID người dùng'),
    apartment_id: objectId.required().label('ID căn hộ'),
    id_card_number: Joi.string().trim().optional().allow('').label('Số CCCD'),
    id_card_date: Joi.date().optional().label('Ngày cấp CCCD'),
    id_card_place: Joi.string().trim().optional().allow('').label('Nơi cấp CCCD'),
    id_card_front_image: Joi.any().optional().label('Ảnh mặt trước CCCD'),
    id_card_back_image: Joi.any().optional().label('Ảnh mặt sau CCCD'),
    date_of_birth: Joi.date().optional().label('Ngày sinh'),
    gender: Joi.string().valid('male', 'female', 'other').optional().label('Giới tính'),
    permanent_address: Joi.string().trim().optional().allow('').label('Địa chỉ thường trú'),
    move_in_date: Joi.date().optional().label('Ngày chuyển vào'),
    move_out_date: Joi.date().optional().label('Ngày chuyển ra'),
    resident_type: Joi.string().valid('owner', 'tenant', 'relative').optional().label('Loại cư dân'),
    is_primary: Joi.boolean().optional().label('Chủ hộ'),
}).unknown(true)

export const updateItem = Joi.object({
    user_id: objectId.optional().label('ID người dùng'),
    apartment_id: objectId.optional().label('ID căn hộ'),
    id_card_number: Joi.string().trim().optional().allow('').label('Số CCCD'),
    id_card_date: Joi.date().optional().label('Ngày cấp CCCD'),
    id_card_place: Joi.string().trim().optional().allow('').label('Nơi cấp CCCD'),
    id_card_front_image: Joi.any().optional().label('Ảnh mặt trước CCCD'),
    id_card_back_image: Joi.any().optional().label('Ảnh mặt sau CCCD'),
    date_of_birth: Joi.date().optional().label('Ngày sinh'),
    gender: Joi.string().valid('male', 'female', 'other').optional().label('Giới tính'),
    permanent_address: Joi.string().trim().optional().allow('').label('Địa chỉ thường trú'),
    move_in_date: Joi.date().optional().label('Ngày chuyển vào'),
    move_out_date: Joi.date().optional().label('Ngày chuyển ra'),
    resident_type: Joi.string().valid('owner', 'tenant', 'relative').optional().label('Loại cư dân'),
    is_primary: Joi.boolean().optional().label('Chủ hộ'),
}).unknown(true)
