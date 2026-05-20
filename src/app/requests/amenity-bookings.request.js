import Joi from 'joi'

export const createItem = Joi.object({
    amenities_code: Joi.string().trim().optional().label('Mã đặt chỗ'),
    amenity_id: Joi.string().hex().length(24).required().label('ID Tiện Ích'),
    resident_id: Joi.string().hex().length(24).required().label('ID Cư Dân'),
    booking_date: Joi.date().required().label('Ngày đặt'),
    start_time: Joi.date().required().label('Giờ bắt đầu'),
    end_time: Joi.date().required().label('Giờ kết thúc'),
    num_people: Joi.number().min(1).required().label('Số người')
})

export const updateItem = Joi.object({
    amenities_code: Joi.string().trim().optional().label('Mã đặt chỗ'),
    amenity_id: Joi.string().hex().length(24).optional().label('ID Tiện Ích'),
    resident_id: Joi.string().hex().length(24).optional().label('ID Cư Dân'),
    booking_date: Joi.date().optional().label('Ngày đặt'),
    start_time: Joi.date().optional().label('Giờ bắt đầu'),
    end_time: Joi.date().optional().label('Giờ kết thúc'),
    num_people: Joi.number().min(1).optional().label('Số người'),
    status: Joi.string().trim().valid('pending', 'approved', 'rejected', 'cancelled').optional().label('Trạng thái')
})
