import createModel from './base'
import bcrypt from 'bcrypt'

const User = createModel(
    'User',
    'users',
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true,
        },
        phone: {
            type: String,
            default: ''
        },
        password: {
            type: String,
            required: true,
            set(value) {
                const salt = bcrypt.genSaltSync(10)
                return bcrypt.hashSync(value, salt)
            },
        },
        role: {
            type: String,
            enum: ['SUPER_ADMIN', 'MANAGER', 'STAFF', 'RESIDENT'],
            required: true,
            default: 'RESIDENT',
        },
        sub: {
            type: String,
            default: '',
        },
        ssoId: {
            type: String,
            default: '',
        },
        email_verified: {
            type: Boolean,
            default: false,
        },
        realm_access: {
            roles: {
                type: [String],
                default: [],
            },
        },
        preferred_username: {
            type: String,
            default: '',
        },
        given_name: {
            type: String,
            default: '',
        },
        family_name: {
            type: String,
            default: '',
        },
        picture: {
            type: String,
            default: '',
        },
        is_active: {
            type: Boolean,
            required: true,
            default: true,
        },
        deleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                // eslint-disable-next-line no-unused-vars
                const { password, deleted, ...result } = ret
                const idStr = result._id.toString()
                result.sub = idStr
                result.ssoId = idStr
                return result
            },
        },
        methods: {
            verifyPassword(password) {
                return bcrypt.compareSync(password, this.password)
            },
        },
        virtuals: {
            permissions: {
                set(value) {
                    this._permissions = value
                },
                get() {
                    return this._permissions
                },
            },
        },
    }
)

export default User
