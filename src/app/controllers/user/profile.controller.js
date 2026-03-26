import * as userService from '@/app/services/user.service'

export async function getProfile(req, res) {
    const user = await userService.getUserProfile(req.currentUser._id)
    res.json({
        code: 200,
        message: 'Success',
        data: {
            id: user._id,
            sub: user._id.toString(),
            ssoId: user._id.toString(),
            email: user.email,
            email_verified: user.email_verified,
            realm_access: {
                roles: [
                    ...new Set([
                        ...(user.realm_access?.roles || []),
                        user.role
                    ])
                ]
            },
            name: user.name,
            preferred_username: user.preferred_username,
            given_name: user.given_name,
            family_name: user.family_name,
            picture: user.picture
        }
    })
}

export async function updateProfile(req, res) {
    const updatedUser = await userService.updateUserProfile(req.currentUser._id, req.body)
    res.jsonify({
        message: 'Cập nhật thông tin thành công',
        user: updatedUser
    })
} 