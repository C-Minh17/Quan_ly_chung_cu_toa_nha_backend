import Joi from 'joi'

const objectId = Joi.string().hex().length(24)

export const createItem = Joi.object({
    apartment_id: objectId.required().label('ID căn hộ'),
    resident_id: objectId.required().label('ID cư dân'),
    contract_code: Joi.string().trim().required().label('Mã hợp đồng'),
    contract_type: Joi.string().valid('purchase', 'rent').required().label('Loại hợp đồng'),
    start_date: Joi.date().required().label('Ngày bắt đầu'),
    end_date: Joi.date().optional().label('Ngày kết thúc'),
    monthly_price: Joi.number().min(0).optional().label('Giá thuê hàng tháng'),
    deposit: Joi.number().min(0).optional().label('Tiền cọc'),
    status: Joi.string().valid('active', 'expired', 'terminated').default('active').label('Trạng thái'),
    file_url: Joi.string().uri().allow('').optional().label('File hợp đồng'),
    notes: Joi.string().trim().allow('').optional().label('Ghi chú'),
}).unknown(true)

export const updateItem = Joi.object({
    end_date: Joi.date().optional().label('Ngày kết thúc'),
    monthly_price: Joi.number().min(0).optional().label('Giá thuê hàng tháng'),
    notes: Joi.string().trim().allow('').optional().label('Ghi chú'),
    status: Joi.string().valid('active', 'expired', 'terminated').optional().label('Trạng thái'),
    file_url: Joi.string().uri().allow('').optional().label('File hợp đồng'),
}).unknown(true)
