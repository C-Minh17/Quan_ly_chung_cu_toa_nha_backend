import cors from 'cors'
import {APP_URL_CLIENT, OTHER_URLS_CLIENT} from '@/configs'

const sanitizeOrigin = (url) => {
    if (typeof url !== 'string') return url
    return url.replace(/\/+$/, '')
}

export const corsOptions = {
    origin: [
        sanitizeOrigin(APP_URL_CLIENT),
        ...OTHER_URLS_CLIENT.map(sanitizeOrigin)
    ].filter(Boolean),
    credentials: true,
}

const corsHandler = cors(corsOptions)

export default corsHandler
