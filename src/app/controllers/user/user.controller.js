import * as userService from '@/app/services/user.service'

export async function getAllUsers(req, res) {
    const users = await userService.getAllUsers()
    res.json({
        code: 200,
        message: 'Success',
        data: users,
    })
}

export async function getUserById(req, res) {
    const user = await userService.getUserById(req.params.id)
    res.json({
        code: 200,
        message: 'Success',
        data: user,
    })
}

export async function createUser(req, res) {
    const user = await userService.createUser(req.body)
    res.json({
        code: 200,
        message: 'Tạo người dùng thành công',
        data: user,
    })
}

export async function updateUser(req, res) {
    const user = await userService.updateUser(req.params.id, req.body)
    res.json({
        code: 200,
        message: 'Cập nhật người dùng thành công',
        data: user,
    })
}

export async function deleteUser(req, res) {
    await userService.deleteUser(req.params.id)
    res.json({
        code: 200,
        message: 'Xóa người dùng thành công',
    })
}

export async function changePassword(req, res) {
    const userId = req.params.id || req.currentUser._id
    await userService.changeUserPassword(userId, req.body.new_password)
    res.json({
        code: 200,
        message: 'Đổi mật khẩu thành công',
    })
}
