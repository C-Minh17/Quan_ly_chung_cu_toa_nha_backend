import { User } from '@/models'
import { abort } from '@/utils/helpers'

function normalizeUser(user) {
    const doc = user.toJSON()
    doc.realm_access = {
        roles: [...new Set([...(doc.realm_access?.roles || []), doc.role])]
    }
    return doc
}

export async function updateUserProfile(userId, profileData) {
    // Kiểm tra nếu cả email và phone đều trống
    if (!profileData.email && !profileData.phone) {
        abort(400, 'Email hoặc số điện thoại là bắt buộc')
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: profileData },
            { new: true }
        )

        if (!updatedUser) {
            abort(404, 'Không tìm thấy người dùng')
        }

        return updatedUser
    } catch (error) {
        if (error.status) throw error
        abort(500, 'Lỗi khi cập nhật thông tin người dùng')
    }
}

export async function getUserProfile(userId) {
    try {
        const user = await User.findOne({ _id: userId, deleted: false })

        if (!user) {
            abort(404, 'Không tìm thấy người dùng')
        }

        return user
    } catch (error) {
        if (error.status) throw error
        abort(500, 'Lỗi khi lấy thông tin người dùng')
    }
}

export async function getAllUsers() {
    try {
        const users = await User.find({ deleted: false })
        return users.map(normalizeUser)
    } catch (error) {
        if (error.status) throw error
        abort(500, 'Lỗi khi lấy danh sách người dùng')
    }
}

export async function getUserById(userId) {
    try {
        const user = await User.findOne({ _id: userId, deleted: false })

        if (!user) {
            abort(404, 'Không tìm thấy người dùng')
        }

        return normalizeUser(user)
    } catch (error) {
        if (error.status) throw error
        abort(500, 'Lỗi khi lấy thông tin người dùng')
    }
}

export async function createUser(userData) {
    try {
        const existingEmail = await User.findOne({ email: userData.email, deleted: false })
        if (existingEmail) {
            abort(400, 'Email đã được sử dụng.')
        }

        if (userData.phone) {
            const existingPhone = await User.findOne({ phone: userData.phone, deleted: false })
            if (existingPhone) {
                abort(400, 'Số điện thoại đã được sử dụng.')
            }
        }

        const name = `${userData.given_name} ${userData.family_name}`.trim()
        const user = await User.create({ ...userData, name })
        return normalizeUser(user)
    } catch (error) {
        if (error.status) throw error
        abort(500, 'Lỗi khi tạo người dùng')
    }
}

export async function updateUser(userId, updateData) {
    try {
        const existingUser = await User.findOne({ _id: userId, deleted: false })
        if (!existingUser) {
            abort(404, 'Không tìm thấy người dùng')
        }

        if (updateData.email) {
            const duplicateEmail = await User.findOne({
                email: updateData.email,
                _id: { $ne: userId },
                deleted: false
            })
            if (duplicateEmail) {
                abort(400, 'Email đã được sử dụng.')
            }
        }

        if (updateData.phone) {
            const duplicatePhone = await User.findOne({
                phone: updateData.phone,
                _id: { $ne: userId },
                deleted: false
            })
            if (duplicatePhone) {
                abort(400, 'Số điện thoại đã được sử dụng.')
            }
        }

        const data = { ...updateData }
        if (updateData.given_name || updateData.family_name) {
            data.name = `${updateData.given_name || existingUser.given_name || ''} ${updateData.family_name || existingUser.family_name || ''}`.trim()
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            abort(404, 'Không tìm thấy người dùng')
        }

        return normalizeUser(updatedUser)
    } catch (error) {
        if (error.status) throw error
        abort(500, 'Lỗi khi cập nhật người dùng')
    }
}

export async function deleteUser(userId) {
    try {
        const deletedUser = await User.findOneAndUpdate(
            { _id: userId, deleted: false },
            { $set: { deleted: true } },
            { new: true }
        )

        if (!deletedUser) {
            abort(404, 'Không tìm thấy người dùng')
        }

        return normalizeUser(deletedUser)
    } catch (error) {
        if (error.status) throw error
        abort(500, 'Lỗi khi xóa người dùng')
    }
}

export async function changeUserPassword(userId, newPassword) {
    try {
        const user = await User.findOne({ _id: userId, deleted: false })
        if (!user) {
            abort(404, 'Không tìm thấy người dùng')
        }

        user.password = newPassword
        await user.save()

        return normalizeUser(user)
    } catch (error) {
        if (error.status) throw error
        abort(500, 'Lỗi khi đổi mật khẩu')
    }
} 