import {abort, getToken} from '@/utils/helpers'
import * as authService from '@/app/services/auth.service'

export async function login(req, res) {
    const validLogin = await authService.checkValidLoginUser(req.body)

    if (validLogin) {
        res.json({
            code: 200,
            message: 'Đăng nhập thành công',
            data: authService.authTokenUser(validLogin)
        })
    } else {
        abort(400, 'Tài khoản hoặc mật khẩu không đúng.')
    }
}

export async function register(req, res) {
    const user = await authService.registerUser(req.body)
    res.json({
        code: 200,
        message: 'Đăng ký tài khoản thành công',
        data: user
    })
}

export async function logout(req, res) {
    const token = getToken(req.headers)
    await authService.blockToken(token)
    res.jsonify('Đăng xuất thành công.')
}

export async function refresh(req, res) {
    const {refresh_token, refreshToken} = req.body
    const token = refresh_token || refreshToken || getToken(req.headers)

    if (!token) {
        abort(400, 'Token là bắt buộc (truyền qua body hoặc header Authorization).')
    }

    const data = await authService.refreshAuthTokenUser(token)
    res.json({
        ...data,
        code: 200,
        message: 'Refresh token thành công'
    })
}
