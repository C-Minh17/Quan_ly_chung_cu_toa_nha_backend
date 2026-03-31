import Joi from 'joi'
import { VALIDATE_PHONE_REGEX, VALIDATE_EMAIL_REGEX, VALIDATE_PASSWORD_REGEX, VALIDATE_FULL_NAME_REGEX } from '@/configs'
import { User } from '@/models'
import { AsyncValidate } from '@/utils/classes'

export const createUser = Joi.object({
    given_name: Joi.string().required().label('Tên'),
    family_name: Joi.string().required().label('Họ'),
    preferred_username: Joi.string().optional().allow('').label('Tên đăng nhập'),
    email: Joi.string().pattern(VALIDATE_EMAIL_REGEX).required().label('Email'),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).allow('', null).optional().label('Số điện thoại'),
    role: Joi.string().valid('SUPER_ADMIN', 'MANAGER', 'STAFF', 'RESIDENT').default('RESIDENT').label('Quyền hạn'),
    password: Joi.string().pattern(VALIDATE_PASSWORD_REGEX).required().label('Mật khẩu'),
})

export const updateUser = Joi.object({
    name: Joi.string().pattern(VALIDATE_FULL_NAME_REGEX).max(50).label('Họ tên'),
    given_name: Joi.string().max(50).label('Tên'),
    family_name: Joi.string().max(50).label('Họ'),
    preferred_username: Joi.string().allow('').label('Tên đăng nhập'),
    email: Joi.string().pattern(VALIDATE_EMAIL_REGEX).label('Email').custom((value, helpers) =>
        new AsyncValidate(value, async function (req) {
            if (!value) return value
            const existingUser = await User.findOne({
                email: value,
                _id: { $ne: req.params.id },
                deleted: false,
            })
            return !existingUser ? value : helpers.error('any.exists')
        })
    ),
    phone: Joi.string().pattern(VALIDATE_PHONE_REGEX).allow('', null).optional().label('Số điện thoại').custom((value, helpers) =>
        new AsyncValidate(value, async function (req) {
            if (!value) return value
            const existingUser = await User.findOne({
                phone: value,
                _id: { $ne: req.params.id },
                deleted: false,
            })
            return !existingUser ? value : helpers.error('any.exists')
        })
    ),
    role: Joi.string().valid('SUPER_ADMIN', 'MANAGER', 'STAFF', 'RESIDENT').label('Quyền hạn'),
    is_active: Joi.boolean().label('Trạng thái kích hoạt'),
    picture: Joi.string().allow('').label('Ảnh đại diện'),
    realm_access: Joi.object({
        roles: Joi.array().items(Joi.string()).label('Roles'),
    }).optional(),
}).min(1)

export const changePassword = Joi.object({
    new_password: Joi.string().pattern(VALIDATE_PASSWORD_REGEX).required().label('Mật khẩu mới'),
    confirm_password: Joi.any()
        .equal(Joi.ref('new_password'))
        .required()
        .label('Xác nhận mật khẩu mới')
        .messages({ 'any.only': '{{#label}} không khớp' }),
})
