import cors from 'cors'
import {APP_URL_CLIENT, OTHER_URLS_CLIENT} from '@/configs'

const sanitizeOrigin = (url) => {
    if (typeof url !== 'string') return url
    return url.replace(/\/+$/, '')
}

const envOrigins = [
    sanitizeOrigin(APP_URL_CLIENT),
    ...OTHER_URLS_CLIENT.map(sanitizeOrigin)
].filter(Boolean)

const allowedOrigins = [
    ...envOrigins,
    'http://localhost:3000',
    'http://localhost:8000',
    'https://quan-ly-chung-cu-toa-nha.netlify.app'
]

export const corsOptions = {
    origin: function (origin, callback) {
        // Cho phép các request không có origin (ví dụ: công cụ test API như Postman, ứng dụng mobile)
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `Cơ chế CORS của API này không cho phép truy cập từ Origin: ${origin}`
            return callback(new Error(msg), false)
        }
        return callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

const corsHandler = cors(corsOptions)

export default corsHandler
