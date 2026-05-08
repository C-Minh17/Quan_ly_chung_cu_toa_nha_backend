import Joi from 'joi'

const objectId = Joi.string().hex().length(24)

export const createItem = Joi.object({
    apartment_id: objectId.required().label('ID căn hộ'),
    fee_type_id:  objectId.required().label('ID loại phí'),
    reading_month: Joi.number().integer().min(1).max(12).required().label('Tháng ghi chỉ số'),
    reading_year:  Joi.number().integer().min(2000).required().label('Năm ghi chỉ số'),
    previous_reading: Joi.number().min(0).optional().allow(null).label('Chỉ số trước'),
    current_reading:  Joi.number().min(0).optional().allow(null).label('Chỉ số hiện tại'),
    recorded_by: objectId.optional().allow(null).label('ID người ghi'),
    recorded_at: Joi.date().optional().allow(null).label('Thời gian ghi'),
}).unknown(true)

export const updateItem = Joi.object({
    apartment_id: objectId.optional().label('ID căn hộ'),
    fee_type_id:  objectId.optional().label('ID loại phí'),
    reading_month: Joi.number().integer().min(1).max(12).optional().label('Tháng ghi chỉ số'),
    reading_year:  Joi.number().integer().min(2000).optional().label('Năm ghi chỉ số'),
    previous_reading: Joi.number().min(0).optional().allow(null).label('Chỉ số trước'),
    current_reading:  Joi.number().min(0).optional().allow(null).label('Chỉ số hiện tại'),
    recorded_by: objectId.optional().allow(null).label('ID người ghi'),
    recorded_at: Joi.date().optional().allow(null).label('Thời gian ghi'),
}).unknown(true)