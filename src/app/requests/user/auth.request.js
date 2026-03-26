import Joi from 'joi'
import { VALIDATE_PHONE_REGEX, VALIDATE_EMAIL_REGEX } from '@/configs'

export const login = Joi.object({
    username: Joi.alternatives()
        .try(
            Joi.string().pattern(VALIDATE_PHONE_REGEX).label('Số điện thoại'),
            Joi.string().pattern(VALIDATE_EMAIL_REGEX).label('Email')
        )
        .required()
        .label('Tài khoản'),
    password: Joi.string().required().label('Mật khẩu'),
})

export const register = Joi.object({
    given_name: Joi.string().required().label('Tên'),
    family_name: Joi.string().required().label('Họ'),
    preferred_username: Joi.string().optional().allow('').label('Tên đăng nhập'),
    email: Joi.string().pattern(VALIDATE_EMAIL_REGEX).required().label('Email'),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).allow('', null).optional().label('Số điện thoại'),
    role: Joi.string().valid('SUPER_ADMIN', 'MANAGER', 'STAFF', 'RESIDENT').default('RESIDENT').label('Quyền hạn'),
    password: Joi.string().required().label('Mật khẩu')
})
