import { abort } from '@/utils/helpers'

export function checkUserRole(...allowedRoles) {
    return async function (req, res, next) {
        const role = req.currentUser?.role

        if (!allowedRoles.includes(role)) {
            abort(403, 'Bạn không có quyền thực hiện thao tác này.')
        }

        await Promise.resolve()
        next()
    }
}
