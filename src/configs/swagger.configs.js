export const swaggerUserPaths = {
    '/auth/login': {
        post: {
            summary: 'Đăng nhập người dùng',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                username: { type: 'string', example: 'example@email.com' },
                                password: { type: 'string', example: 'password123' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Đăng nhập thành công' }
            }
        }
    },
    '/auth/register': {
        post: {
            summary: 'Đăng ký người dùng',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                given_name: { type: 'string', example: 'Nam' },
                                family_name: { type: 'string', example: 'Nguyễn' },
                                preferred_username: { type: 'string', example: 'namnguyen' },
                                email: { type: 'string', example: 'namnguyen@email.com' },
                                phone: { type: 'string', example: '0987654321' },
                                role: { type: 'string', example: 'RESIDENT' },
                                password: { type: 'string', example: 'password123' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Đăng ký thành công' }
            }
        }
    },
    '/auth/logout': {
        post: {
            summary: 'Đăng xuất người dùng',
            tags: ['Auth'],
            security: [
                { bearerAuth: [] }
            ],
            responses: {
                200: { description: 'Đăng xuất thành công' }
            }
        }
    },
    '/auth/refresh': {
        post: {
            summary: 'Làm mới token',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                grant_type: { type: 'string', example: 'refresh_token' },
                                refreshToken: { type: 'string', example: 'your_refresh_token_here' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Làm mới token thành công' }
            }
        }
    },
    '/user/me': {
        get: {
            summary: 'Lấy thông tin cá nhân',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            responses: {
                200: {
                    description: 'Lấy thông tin thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                                    username: { type: 'string', example: 'namnguyen' },
                                    email: { type: 'string', example: 'namnguyen@email.com' },
                                    phone: { type: 'string', example: '0987654321' },
                                    name: { type: 'string', example: 'Nguyễn Văn Nam' },
                                    given_name: { type: 'string', example: 'Nam' },
                                    family_name: { type: 'string', example: 'Nguyễn' },
                                    role: { type: 'string', example: 'RESIDENT' },
                                    gender: { type: 'string', example: 'male' },
                                    dob: { type: 'string', format: 'date', example: '1990-01-01' },
                                    address: { type: 'string', example: 'Số 1, đường 2, quận 3' },
                                    picture: { type: 'string', example: 'https://example.com/image.jpg' },
                                    createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00.000Z' },
                                    updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00.000Z' }
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            summary: 'Cập nhật thông tin cá nhân',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Nguyễn Văn A' },
                                email: { type: 'string', example: 'nva@email.com' },
                                phone: { type: 'string', example: '0987654321' },
                                gender: { type: 'string', example: 'male' },
                                dob: { type: 'string', format: 'date', example: '1990-01-01' },
                                address: { type: 'string', example: 'Số 1, đường 2, quận 3' },
                                picture: { type: 'string', example: 'https://example.com/image.jpg' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cập nhật thông tin thành công' }
            }
        }
    },
    '/user': {
        get: {
            summary: 'Lấy danh sách tất cả người dùng',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            responses: {
                200: {
                    description: 'Lấy danh sách người dùng thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string', example: '69c63db01d715244de4e7f84' },
                                        name: { type: 'string', example: 'Nhân Viên Nguyễn' },
                                        email: { type: 'string', example: 'nhanvien@gmail.com' },
                                        phone: { type: 'string', example: '0987654321' },
                                        role: { type: 'string', example: 'STAFF' },
                                        sub: { type: 'string', example: '69c63db01d715244de4e7f84' },
                                        ssoId: { type: 'string', example: '69c63db01d715244de4e7f84' },
                                        email_verified: { type: 'boolean', example: false },
                                        realm_access: {
                                            type: 'object',
                                            properties: {
                                                roles: {
                                                    type: 'array',
                                                    items: { type: 'string' },
                                                    example: ['STAFF']
                                                }
                                            }
                                        },
                                        preferred_username: { type: 'string', example: 'nhanvien' },
                                        given_name: { type: 'string', example: 'Nhân Viên' },
                                        family_name: { type: 'string', example: 'Nguyễn' },
                                        picture: { type: 'string', example: '' },
                                        is_active: { type: 'boolean', example: true },
                                        created_at: { type: 'string', format: 'date-time', example: '2026-03-27T08:20:00.186Z' },
                                        updated_at: { type: 'string', format: 'date-time', example: '2026-03-27T08:20:00.186Z' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: 'Tạo người dùng mới',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                given_name: { type: 'string', example: 'Nhân' },
                                family_name: { type: 'string', example: 'Viên' },
                                preferred_username: { type: 'string', example: 'nhanvien' },
                                email: { type: 'string', example: 'nhanvien@gmail.com' },
                                phone: { type: 'string', example: '0987654321' },
                                role: { type: 'string', example: 'STAFF' },
                                password: { type: 'string', example: 'Password@123' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Tạo người dùng thành công' }
            }
        }
    },
    '/user/{id}': {
        get: {
            summary: 'Lấy thông tin người dùng theo ID',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
                200: {
                    description: 'Lấy thông tin người dùng thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '69c63db01d715244de4e7f84' },
                                    name: { type: 'string', example: 'Nhân Viên Nguyễn' },
                                    email: { type: 'string', example: 'nhanvien@gmail.com' },
                                    phone: { type: 'string', example: '0987654321' },
                                    role: { type: 'string', example: 'STAFF' },
                                    sub: { type: 'string', example: '69c63db01d715244de4e7f84' },
                                    ssoId: { type: 'string', example: '69c63db01d715244de4e7f84' },
                                    email_verified: { type: 'boolean', example: false },
                                    realm_access: {
                                        type: 'object',
                                        properties: {
                                            roles: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                example: ['STAFF']
                                            }
                                        }
                                    },
                                    preferred_username: { type: 'string', example: 'nhanvien' },
                                    given_name: { type: 'string', example: 'Nhân Viên' },
                                    family_name: { type: 'string', example: 'Nguyễn' },
                                    picture: { type: 'string', example: '' },
                                    is_active: { type: 'boolean', example: true },
                                    created_at: { type: 'string', format: 'date-time', example: '2026-03-27T08:20:00.186Z' },
                                    updated_at: { type: 'string', format: 'date-time', example: '2026-03-27T08:20:00.186Z' }
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            summary: 'Cập nhật thông tin người dùng theo ID',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Nhân Viên Nguyễn' },
                                preferred_username: { type: 'string', example: 'nhanvien' },
                                email: { type: 'string', example: 'nhanvien@gmail.com' },
                                phone: { type: 'string', example: '0987654321' },
                                role: { type: 'string', example: 'STAFF' },
                                is_active: { type: 'boolean', example: true },
                                picture: { type: 'string', example: '' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cập nhật người dùng thành công' }
            }
        },
        delete: {
            summary: 'Xóa người dùng theo ID',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
                200: { description: 'Xóa người dùng thành công' }
            }
        }
    },
    '/user/password': {
        patch: {
            summary: 'Đổi mật khẩu người dùng hiện tại',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                new_password: { type: 'string', example: 'NewPassword@123' },
                                confirm_password: { type: 'string', example: 'NewPassword@123' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Đổi mật khẩu thành công' }
            }
        }
    },
    '/user/{id}/password': {
        patch: {
            summary: 'Đổi mật khẩu cho user khác theo ID',
            tags: ['User'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                new_password: { type: 'string', example: 'NewPassword@123' },
                                confirm_password: { type: 'string', example: 'NewPassword@123' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Đổi mật khẩu thành công' }
            }
        }
    }
}

// export const swaggerAdminPaths = {
//     '/admin/auth/login': {
//         post: {
//             summary: 'Đăng nhập admin',
//             tags: ['Admin Auth'],
//             requestBody: {
//                 required: true,
//                 content: {
//                     'application/json': {
//                         schema: {
//                             type: 'object',
//                             properties: {
//                                 phone: { type: 'string', example: '0987654321' },
//                                 password: { type: 'string', example: 'password123' }
//                             }
//                         }
//                     }
//                 }
//             },
//             responses: { 200: { description: 'Đăng nhập admin thành công' } }
//         }
//     },
//     '/admin/auth/logout': {
//         post: {
//             summary: 'Đăng xuất admin',
//             tags: ['Admin Auth'],
//             security: [{ bearerAuth: [] }],
//             responses: { 200: { description: 'Đăng xuất admin thành công' } }
//         }
//     },
//     '/admin/auth/me': {
//         get: {
//             summary: 'Lấy thông tin cá nhân admin',
//             tags: ['Admin Auth'],
//             security: [{ bearerAuth: [] }],
//             responses: {
//                 200: {
//                     description: 'Lấy thông tin cá nhân thành công',
//                     content: {
//                         'application/json': {
//                             schema: {
//                                 type: 'object',
//                                 properties: {
//                                     _id: { type: 'string', example: '65f0a12b3c4d5e6f7g8h9i0j' },
//                                     name: { type: 'string', example: 'Quản Trị Viên Hệ Thống' },
//                                     phone: { type: 'string', example: '0987654321' },
//                                     email: { type: 'string', example: 'admin@system.com' },
//                                     is_protected: { type: 'boolean', example: false },
//                                     roles: {
//                                         type: 'array',
//                                         items: {
//                                             type: 'object',
//                                             properties: {
//                                                 _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
//                                                 name: { type: 'string', example: 'Super Admin' },
//                                                 description: { type: 'string', example: 'Quản trị tối cao' }
//                                             }
//                                         }
//                                     },
//                                     createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
//                                     updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     },
//     '/admin/roles': {
//         get: {
//             summary: 'Lấy danh sách vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             responses: {
//                 200: {
//                     description: 'Lấy danh sách thành công',
//                     content: {
//                         'application/json': {
//                             schema: {
//                                 type: 'array',
//                                 items: {
//                                     type: 'object',
//                                     properties: {
//                                         _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
//                                         name: { type: 'string', example: 'Super Admin' },
//                                         parent_id: { type: 'string', example: null, nullable: true },
//                                         description: { type: 'string', example: 'Quản trị tối cao' },
//                                         createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
//                                         updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         post: {
//             summary: 'Tạo vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             requestBody: {
//                 required: true,
//                 content: {
//                     'application/json': {
//                         schema: {
//                             type: 'object',
//                             properties: {
//                                 name: { type: 'string', example: 'Admin' },
//                                 parent_id: { type: 'string', example: null },
//                                 description: { type: 'string', example: 'Quản trị viên' }
//                             }
//                         }
//                     }
//                 }
//             },
//             responses: { 200: { description: 'Thành công' } }
//         }
//     },
//     '/admin/roles/permission-types': {
//         get: {
//             summary: 'Lấy danh sách loại quyền',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             responses: {
//                 200: {
//                     description: 'Lấy danh sách loại quyền thành công',
//                     content: {
//                         'application/json': {
//                             schema: {
//                                 type: 'array',
//                                 items: {
//                                     type: 'object',
//                                     properties: {
//                                         _id: { type: 'string', example: '65f0c34d5e6f7g8h9i0j1k2l' },
//                                         name: { type: 'string', example: 'Quản lý người dùng' },
//                                         code: { type: 'string', example: 'USER_MANAGEMENT' },
//                                         description: { type: 'string', example: 'Nhóm quyền liên quan đến quản lý người dùng' },
//                                         createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
//                                         updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     },
//     '/admin/roles/{roleId}': {
//         put: {
//             summary: 'Cập nhật vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             parameters: [
//                 { name: 'roleId', in: 'path', required: true, schema: { type: 'string' } }
//             ],
//             requestBody: {
//                 required: true,
//                 content: {
//                     'application/json': {
//                         schema: {
//                             type: 'object',
//                             properties: {
//                                 name: { type: 'string', example: 'Admin' },
//                                 parent_id: { type: 'string', example: null },
//                                 description: { type: 'string', example: 'Quản trị viên cấp cao' }
//                             }
//                         }
//                     }
//                 }
//             },
//             responses: { 200: { description: 'Thành công' } }
//         },
//         delete: {
//             summary: 'Xóa vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             parameters: [
//                 { name: 'roleId', in: 'path', required: true, schema: { type: 'string' } }
//             ],
//             responses: { 200: { description: 'Xóa vai trò thành công' } }
//         }
//     },
//     '/admin/roles/{roleId}/permissions': {
//         get: {
//             summary: 'Lấy danh sách quyền của vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             parameters: [
//                 { name: 'roleId', in: 'path', required: true, schema: { type: 'string' } }
//             ],
//             responses: { 200: { description: 'Lấy danh sách quyền của vai trò thành công' } }
//         }
//     },
//     '/admin/roles/{roleId}/update-permission-for-role/{permissionId}': {
//         patch: {
//             summary: 'Cập nhật phân quyền cho vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             parameters: [
//                 { name: 'roleId', in: 'path', required: true, schema: { type: 'string' } },
//                 { name: 'permissionId', in: 'path', required: true, schema: { type: 'string' } }
//             ],
//             responses: { 200: { description: 'Cập nhật phân quyền cho vai trò thành công' } }
//         }
//     },
//     '/admin/roles/{roleId}/accounts': {
//         get: {
//             summary: 'Lấy danh sách tài khoản thuộc vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             parameters: [
//                 { name: 'roleId', in: 'path', required: true, schema: { type: 'string' } },
//                 { name: 'q', in: 'query', schema: { type: 'string' } },
//                 { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
//                 { name: 'per_page', in: 'query', schema: { type: 'integer', default: 50 } }
//             ],
//             responses: { 200: { description: 'Lấy danh sách tài khoản thuộc vai trò thành công' } }
//         }
//     },
//     '/admin/roles/{roleId}/accounts-without-role': {
//         get: {
//             summary: 'Lấy danh sách tài khoản không thuộc vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             parameters: [
//                 { name: 'roleId', in: 'path', required: true, schema: { type: 'string' } },
//                 { name: 'q', in: 'query', schema: { type: 'string' } },
//                 { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
//                 { name: 'per_page', in: 'query', schema: { type: 'integer', default: 50 } }
//             ],
//             responses: { 200: { description: 'Lấy danh sách tài khoản không thuộc vai trò thành công' } }
//         }
//     },
//     '/admin/roles/{roleId}/add-accounts': {
//         patch: {
//             summary: 'Thêm tài khoản vào vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             parameters: [
//                 { name: 'roleId', in: 'path', required: true, schema: { type: 'string' } }
//             ],
//             requestBody: {
//                 required: true,
//                 content: {
//                     'application/json': {
//                         schema: {
//                             type: 'object',
//                             properties: {
//                                 account_ids: { type: 'array', items: { type: 'string' }, example: ['account-id-1'] }
//                             }
//                         }
//                     }
//                 }
//             },
//             responses: { 200: { description: 'Thêm tài khoản vào vai trò thành công' } }
//         }
//     },
//     '/admin/roles/{roleId}/delete-account-in-role/{accountId}': {
//         delete: {
//             summary: 'Xóa tài khoản khỏi vai trò',
//             tags: ['Admin Roles'],
//             security: [{ bearerAuth: [] }],
//             parameters: [
//                 { name: 'roleId', in: 'path', required: true, schema: { type: 'string' } },
//                 { name: 'accountId', in: 'path', required: true, schema: { type: 'string' } }
//             ],
//             responses: { 200: { description: 'Xóa tài khoản khỏi vai trò thành công' } }
//         }
//     }
// }

export const swaggerBuildingPaths = {
    '/buildings': {
        get: {
            summary: 'Lấy danh sách tòa nhà',
            tags: ['Buildings'],
            security: [
                { bearerAuth: [] }
            ],
            responses: {
                200: {
                    description: 'Lấy danh sách tòa nhà thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                        name: { type: 'string', example: 'Tòa nhà A' },
                                        address: { type: 'string', example: '123 Đường B' },
                                        total_floors: { type: 'integer', example: 10 },
                                        description: { type: 'string', example: 'Mô tả chi tiết tòa nhà' },
                                        created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: 'Thêm mới tòa nhà',
            tags: ['Buildings'],
            security: [
                { bearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Tòa nhà A' },
                                address: { type: 'string', example: '123 Đường B' },
                                total_floors: { type: 'integer', example: 10 },
                                description: { type: 'string', example: 'Mô tả chi tiết tòa nhà' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Thêm mới tòa nhà thành công' },
                400: { description: 'Dữ liệu không hợp lệ' }
            }
        }
    },
    '/buildings/{id}': {
        get: {
            summary: 'Lấy thông tin chi tiết tòa nhà',
            tags: ['Buildings'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của tòa nhà',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: {
                    description: 'Lấy thông tin tòa nhà thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                    name: { type: 'string', example: 'Tòa nhà A' },
                                    address: { type: 'string', example: '123 Đường B' },
                                    total_floors: { type: 'integer', example: 10 },
                                    description: { type: 'string', example: 'Mô tả chi tiết tòa nhà' },
                                    created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                }
                            }
                        }
                    }
                },
                400: { description: 'ID không hợp lệ' },
                404: { description: 'Không tìm thấy tòa nhà' }
            }
        },
        put: {
            summary: 'Cập nhật tòa nhà',
            tags: ['Buildings'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của tòa nhà',
                    schema: { type: 'string' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Tòa nhà A (Cập nhật)' },
                                address: { type: 'string', example: '123 Đường B' },
                                total_floors: { type: 'integer', example: 12 },
                                description: { type: 'string', example: 'Mô tả chi tiết tòa nhà sau cập nhật' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cập nhật tòa nhà thành công' },
                400: { description: 'Dữ liệu không hợp lệ' },
                404: { description: 'Không tìm thấy tòa nhà' }
            }
        },
        delete: {
            summary: 'Xóa tòa nhà',
            tags: ['Buildings'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của tòa nhà',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: { description: 'Xóa tòa nhà thành công' },
                400: { description: 'ID không hợp lệ' },
                404: { description: 'Không tìm thấy tòa nhà' }
            }
        }
    }
}

export const swaggerFloorPaths = {
    '/floors': {
        get: {
            summary: 'Lấy danh sách tầng',
            tags: ['Floors'],
            security: [
                { bearerAuth: [] }
            ],
            responses: {
                200: {
                    description: 'Lấy danh sách tầng thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1l' },
                                        name: { type: 'string', example: 'Tầng 1' },
                                        floor_number: { type: 'integer', example: 1 },
                                        building: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                                name: { type: 'string', example: 'Tòa nhà A' },
                                                address: { type: 'string', example: '123 Đường B' },
                                                total_floors: { type: 'integer', example: 10 },
                                                description: { type: 'string', example: 'Mô tả chi tiết tòa nhà' },
                                                created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                                                updated_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                            }
                                        },
                                        description: { type: 'string', example: 'Mô tả chi tiết tầng 1' },
                                        created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                                        updated_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                    }
                                }
                            }
                        }
                    }
                },
                404: { description: 'Không tìm thấy tầng' }
            }
        },
        post: {
            summary: 'Thêm mới tầng',
            tags: ['Floors'],
            security: [
                { bearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Tầng 1' },
                                floor_number: { type: 'integer', example: 1 },
                                building_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                description: { type: 'string', example: 'Mô tả chi tiết tầng 1' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Thêm mới tầng thành công' },
                400: { description: 'Dữ liệu không hợp lệ' }
            }
        }
    },
    '/floors/{id}': {
        get: {
            summary: 'Lấy thông tin chi tiết tầng',
            tags: ['Floors'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của tầng',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: {
                    description: 'Lấy thông tin tầng thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1l' },
                                    name: { type: 'string', example: 'Tầng 1' },
                                    floor_number: { type: 'integer', example: 1 },
                                    building: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                            name: { type: 'string', example: 'Tòa nhà A' },
                                            address: { type: 'string', example: '123 Đường B' },
                                            total_floors: { type: 'integer', example: 10 },
                                            description: { type: 'string', example: 'Mô tả chi tiết tòa nhà' },
                                            created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                                            updated_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                        }
                                    },
                                    description: { type: 'string', example: 'Mô tả chi tiết tầng 1' },
                                    created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                                    updated_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                }
                            }
                        }
                    }
                },
                400: { description: 'ID không hợp lệ' },
                404: { description: 'Không tìm thấy tầng' }
            }
        },
        put: {
            summary: 'Cập nhật tầng',
            tags: ['Floors'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của tầng',
                    schema: { type: 'string' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Tầng 1 (Cập nhật)' },
                                floor_number: { type: 'integer', example: 1 },
                                building_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                description: { type: 'string', example: 'Mô tả chi tiết tầng sau cập nhật' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cập nhật tầng thành công' },
                400: { description: 'Dữ liệu không hợp lệ' },
                404: { description: 'Không tìm thấy tầng' }
            }
        },
        delete: {
            summary: 'Xóa tầng',
            tags: ['Floors'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của tầng',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: { description: 'Xóa tầng thành công' },
                400: { description: 'ID không hợp lệ' },
                404: { description: 'Không tìm thấy tầng' }
            }
        }
    },
    '/floors/{id}/layout': {
        get: {
            summary: 'Lấy sơ đồ tầng - grid căn hộ theo trạng thái',
            tags: ['Floors'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của tầng',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: {
                    description: 'Lấy sơ đồ tầng thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    floor: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1l' },
                                            name: { type: 'string', example: 'Tầng 1' },
                                            floor_number: { type: 'integer', example: 1 }
                                        }
                                    },
                                    apartments: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1m' },
                                                apartment_code: { type: 'string', example: 'A-0101' },
                                                status: { type: 'string', example: 'vacant' },
                                                area: { type: 'number', example: 75.5 },
                                                num_bedrooms: { type: 'integer', example: 2 },
                                                num_bathrooms: { type: 'integer', example: 2 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                404: { description: 'Không tìm thấy tầng' }
            }
        }
    }
}


export const swaggerApartmentPaths = {
    '/apartments': {
        get: {
            summary: 'Lấy danh sách căn hộ',
            tags: ['Apartments'],
            security: [
                { bearerAuth: [] }
            ],
            responses: {
                200: {
                    description: 'Lấy danh sách căn hộ thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1m' },
                                        apartment_code: { type: 'string', example: 'A-0101' },
                                        area: { type: 'number', example: 75.5 },
                                        num_bedrooms: { type: 'integer', example: 2 },
                                        num_bathrooms: { type: 'integer', example: 2 },
                                        apartment_type: { type: 'string', example: 'Tiêu chuẩn' },
                                        status: { type: 'string', example: 'Trống' },
                                        price: { type: 'number', example: 15000000 },
                                        floor: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1l' },
                                                name: { type: 'string', example: 'Tầng 1' },
                                                floor_number: { type: 'integer', example: 1 },
                                                building_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                                description: { type: 'string', example: 'Mô tả chi tiết tầng 1' },
                                                created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                                                updated_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                            }
                                        },
                                        created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: 'Thêm mới căn hộ',
            tags: ['Apartments'],
            security: [
                { bearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                apartment_code: { type: 'string', example: '101', description: 'Mã căn hộ (Tự động tạo nếu để trống theo format: Tầng + STT, VD: 101, 102)' },
                                floor_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1l' },
                                area: { type: 'number', example: 75.5 },
                                num_bedrooms: { type: 'integer', example: 2 },
                                num_bathrooms: { type: 'integer', example: 2 },
                                apartment_type: { type: 'string', example: 'Tiêu chuẩn' },
                                status: { type: 'string', example: 'Trống' },
                                price: { type: 'number', example: 15000000 }
                            },
                            required: ['floor_id', 'area', 'num_bedrooms', 'num_bathrooms', 'apartment_type', 'status', 'price']
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Thêm mới căn hộ thành công' },
                400: { description: 'Dữ liệu không hợp lệ' }
            }
        }
    },
    '/apartments/{id}': {
        get: {
            summary: 'Lấy thông tin chi tiết căn hộ',
            tags: ['Apartments'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của căn hộ',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: {
                    description: 'Lấy thông tin căn hộ thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1m' },
                                    apartment_code: { type: 'string', example: 'A-0101' },
                                    area: { type: 'number', example: 75.5 },
                                    num_bedrooms: { type: 'integer', example: 2 },
                                    num_bathrooms: { type: 'integer', example: 2 },
                                    apartment_type: { type: 'string', example: 'Tiêu chuẩn' },
                                    status: { type: 'string', example: 'Trống' },
                                    price: { type: 'number', example: 15000000 },
                                    floor: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1l' },
                                            name: { type: 'string', example: 'Tầng 1' },
                                            floor_number: { type: 'integer', example: 1 },
                                            building_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                            description: { type: 'string', example: 'Mô tả chi tiết tầng 1' },
                                            created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                                            updated_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                        }
                                    },
                                    created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                }
                            }
                        }
                    }
                },
                400: { description: 'ID không hợp lệ' },
                404: { description: 'Không tìm thấy căn hộ' }
            }
        },
        put: {
            summary: 'Cập nhật căn hộ',
            tags: ['Apartments'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của căn hộ',
                    schema: { type: 'string' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                apartment_code: { type: 'string', example: 'A-0101' },
                                floor_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1l' },
                                area: { type: 'number', example: 75.5 },
                                num_bedrooms: { type: 'integer', example: 2 },
                                num_bathrooms: { type: 'integer', example: 2 },
                                apartment_type: { type: 'string', example: 'Tiêu chuẩn' },
                                status: { type: 'string', example: 'Đang bảo trì' },
                                price: { type: 'number', example: 15000000 }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cập nhật căn hộ thành công' },
                400: { description: 'Dữ liệu không hợp lệ' },
                404: { description: 'Không tìm thấy căn hộ' }
            }
        },
        delete: {
            summary: 'Xóa căn hộ',
            tags: ['Apartments'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của căn hộ',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: { description: 'Xóa căn hộ thành công' },
                400: { description: 'ID không hợp lệ' },
                404: { description: 'Không tìm thấy căn hộ' }
            }
        }
    },
    '/apartments/{id}/status': {
        patch: {
            summary: 'Cập nhật trạng thái căn hộ',
            tags: ['Apartments'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của căn hộ',
                    schema: { type: 'string' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'string',
                                    enum: ['occupied', 'vacant', 'maintenance'],
                                    example: 'occupied'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cập nhật trạng thái căn hộ thành công' },
                400: { description: 'Dữ liệu không hợp lệ' },
                404: { description: 'Không tìm thấy căn hộ' }
            }
        }
    }
}

export const swaggerResidentPaths = {
    '/residents': {
        get: {
            summary: 'Lấy danh sách cư dân',
            tags: ['Residents'],
            security: [
                { bearerAuth: [] }
            ],
            responses: {
                200: {
                    description: 'Lấy danh sách cư dân thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1n' },
                                        user_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1a' },
                                        apartment_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1b' },
                                        id_card_number: { type: 'string', example: '012345678901' },
                                        id_card_date: { type: 'string', format: 'date', example: '2020-01-01' },
                                        id_card_place: { type: 'string', example: 'Hà Nội' },
                                        id_card_front_image: { type: 'string', example: 'uploads/cccd-front.jpg' },
                                        id_card_back_image: { type: 'string', example: 'uploads/cccd-back.jpg' },
                                        date_of_birth: { type: 'string', format: 'date', example: '1990-01-01' },
                                        gender: { type: 'string', example: 'male' },
                                        permanent_address: { type: 'string', example: '123 Đường A, Quận B' },
                                        move_in_date: { type: 'string', format: 'date', example: '2024-01-01' },
                                        move_out_date: { type: 'string', format: 'date', example: '2025-01-01' },
                                        resident_type: { type: 'string', example: 'tenant' },
                                        is_primary: { type: 'boolean', example: false },
                                        created_at: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1a' },
                                                name: { type: 'string', example: 'Nguyễn Văn A' },
                                                email: { type: 'string', example: 'nva@email.com' },
                                                phone: { type: 'string', example: '0987654321' }
                                            }
                                        },
                                        apartment: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1b' },
                                                apartment_code: { type: 'string', example: 'A-0101' },
                                                area: { type: 'number', example: 75.5 },
                                                status: { type: 'string', example: 'Trống' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: 'Tạo cư dân mới',
            tags: ['Residents'],
            security: [
                { bearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                user_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1a' },
                                apartment_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1b' },
                                id_card_number: { type: 'string', example: '012345678901' },
                                id_card_date: { type: 'string', format: 'date', example: '2020-01-01' },
                                id_card_place: { type: 'string', example: 'Hà Nội' },
                                id_card_front_image: { type: 'string', format: 'binary' },
                                id_card_back_image: { type: 'string', format: 'binary' },
                                date_of_birth: { type: 'string', format: 'date', example: '1990-01-01' },
                                gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
                                permanent_address: { type: 'string', example: '123 Đường A, Quận B' },
                                move_in_date: { type: 'string', format: 'date', example: '2024-01-01' },
                                move_out_date: { type: 'string', format: 'date', example: '2025-01-01' },
                                resident_type: { type: 'string', enum: ['owner', 'tenant', 'relative'], example: 'tenant' },
                                is_primary: { type: 'boolean', example: false }
                            },
                            required: ['apartment_id']
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Tạo cư dân thành công' },
                400: { description: 'Dữ liệu không hợp lệ' }
            }
        }
    },
    '/residents/me': {
        get: {
            summary: 'Lấy thông tin cư dân của tôi',
            tags: ['Residents'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: 'Thành công' },
                404: { description: 'Không tìm thấy hồ sơ cư dân' }
            }
        }
    },
    '/residents/{id}': {
        get: {
            summary: 'Lấy thông tin cư dân theo ID',
            tags: ['Residents'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của cư dân',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: {
                    description: 'Lấy thông tin cư dân thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1n' },
                                    user_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1a' },
                                    apartment_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1b' },
                                    id_card_number: { type: 'string', example: '012345678901' },
                                    id_card_date: { type: 'string', format: 'date', example: '2020-01-01' },
                                    id_card_place: { type: 'string', example: 'Hà Nội' },
                                    id_card_front_image: { type: 'string', example: 'uploads/cccd-front.jpg' },
                                    id_card_back_image: { type: 'string', example: 'uploads/cccd-back.jpg' },
                                    date_of_birth: { type: 'string', format: 'date', example: '1990-01-01' },
                                    gender: { type: 'string', example: 'male' },
                                    permanent_address: { type: 'string', example: '123 Đường A, Quận B' },
                                    move_in_date: { type: 'string', format: 'date', example: '2024-01-01' },
                                    move_out_date: { type: 'string', format: 'date', example: '2025-01-01' },
                                    resident_type: { type: 'string', example: 'tenant' },
                                    is_primary: { type: 'boolean', example: false },
                                    created_at: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                                    user: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1a' },
                                            name: { type: 'string', example: 'Nguyễn Văn A' },
                                            email: { type: 'string', example: 'nva@email.com' },
                                            phone: { type: 'string', example: '0987654321' }
                                        }
                                    },
                                    apartment: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1b' },
                                            apartment_code: { type: 'string', example: 'A-0101' },
                                            area: { type: 'number', example: 75.5 },
                                            status: { type: 'string', example: 'Trống' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: { description: 'ID không hợp lệ' },
                404: { description: 'Không tìm thấy cư dân' }
            }
        },
        put: {
            summary: 'Cập nhật cư dân',
            tags: ['Residents'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của cư dân',
                    schema: { type: 'string' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                user_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1a' },
                                apartment_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1b' },
                                id_card_number: { type: 'string', example: '012345678901' },
                                id_card_date: { type: 'string', format: 'date', example: '2020-01-01' },
                                id_card_place: { type: 'string', example: 'Hà Nội' },
                                id_card_front_image: { type: 'string', format: 'binary' },
                                id_card_back_image: { type: 'string', format: 'binary' },
                                date_of_birth: { type: 'string', format: 'date', example: '1990-01-01' },
                                gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
                                permanent_address: { type: 'string', example: '123 Đường A, Quận B' },
                                move_in_date: { type: 'string', format: 'date', example: '2024-01-01' },
                                move_out_date: { type: 'string', format: 'date', example: '2025-01-01' },
                                resident_type: { type: 'string', enum: ['owner', 'tenant', 'relative'], example: 'tenant' },
                                is_primary: { type: 'boolean', example: false }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cập nhật cư dân thành công' },
                400: { description: 'Dữ liệu không hợp lệ' },
                404: { description: 'Không tìm thấy cư dân' }
            }
        },
        delete: {
            summary: 'Xóa cư dân',
            tags: ['Residents'],
            security: [
                { bearerAuth: [] }
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID của cư dân',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: { description: 'Xóa cư dân thành công' },
                400: { description: 'ID không hợp lệ' },
                404: { description: 'Không tìm thấy cư dân' }
            }
        }
    }
}

export const swaggerContractsPaths = {
    '/contracts': {
        get: {
            summary: 'Lấy danh sách hợp đồng',
            tags: ['Contracts'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Tìm kiếm' },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'per_page', in: 'query', schema: { type: 'integer', default: 50 } }
            ],
            responses: {
                200: { description: 'Thành công' }
            }
        },
        post: {
            summary: 'Tạo mới hợp đồng',
            tags: ['Contracts'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                apartment_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                resident_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                contract_code: { type: 'string', example: 'HD-001' },
                                contract_type: { type: 'string', example: 'rent', description: 'rent hoặc purchase' },
                                start_date: { type: 'string', format: 'date', example: '2024-01-01' },
                                end_date: { type: 'string', format: 'date', example: '2024-12-31' },
                                monthly_price: { type: 'number', example: 5000000 },
                                deposit: { type: 'number', example: 10000000 },
                                status: { type: 'string', example: 'active', description: 'active, expired, hoặc terminated' },
                                file_url: { type: 'string', example: 'https://example.com/file.pdf' },
                                notes: { type: 'string', example: 'Ghi chú hợp đồng' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Tạo thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'Tạo hợp đồng thành công' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/contracts/me': {
        get: {
            summary: 'Lấy thông tin hợp đồng của tôi',
            tags: ['Contracts'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: 'Thành công' }
            }
        }
    },
    '/contracts/{id}': {
        get: {
            summary: 'Lấy thông tin chi tiết hợp đồng',
            tags: ['Contracts'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
                200: { description: 'Thành công' }
            }
        },
        put: {
            summary: 'Cập nhật hợp đồng',
            tags: ['Contracts'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                end_date: { type: 'string', format: 'date', example: '2024-12-31' },
                                monthly_price: { type: 'number', example: 5500000 },
                                notes: { type: 'string', example: 'Ghi chú cập nhật' },
                                status: { type: 'string', example: 'active' },
                                file_url: { type: 'string', example: 'https://example.com/file.pdf' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Cập nhật thành công' }
            }
        }
    },
    '/contracts/{id}/terminate': {
        patch: {
            summary: 'Chấm dứt hợp đồng',
            tags: ['Contracts'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
                200: { description: 'Chấm dứt thành công' }
            }
        }
    }
}

export const swaggerVehiclesPaths = {
    '/vehicles': {
        get: {
            summary: 'Lấy danh sách phương tiện',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'resident_id', in: 'query', schema: { type: 'string' }, description: 'Lọc theo ID cư dân' },
                { name: 'vehicle_type', in: 'query', schema: { type: 'string', enum: ['motorbike', 'car', 'bicycle'] }, description: 'Lọc theo loại xe' },
                { name: 'license_plate', in: 'query', schema: { type: 'string' }, description: 'Tìm theo biển số' }
            ],
            responses: {
                200: {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string' },
                                                resident_id: { type: 'string' },
                                                resident: { type: 'object' },
                                                license_plate: { type: 'string' },
                                                vehicle_type: { type: 'string' },
                                                brand: { type: 'string' },
                                                color: { type: 'string' },
                                                card_number: { type: 'string' },
                                                is_active: { type: 'boolean' },
                                                created_at: { type: 'string', format: 'date-time' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: 'Đăng ký phương tiện mới',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                resident_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                license_plate: { type: 'string', example: '29A-123.45' },
                                vehicle_type: { type: 'string', enum: ['motorbike', 'car', 'bicycle'], example: 'motorbike' },
                                brand: { type: 'string', example: 'Honda' },
                                color: { type: 'string', example: 'Đen' },
                                card_number: { type: 'string', example: 'V-001' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Đăng ký thành công' } }
        }
    },
    '/vehicles/me': {
        get: {
            summary: 'Lấy thông tin phương tiện của tôi',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: 'Thành công' }
            }
        }
    },
    '/vehicles/{id}': {
        get: {
            summary: 'Chi tiết phương tiện',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
                200: { description: 'Thành công' }
            }
        },
        put: {
            summary: 'Cập nhật thông tin phương tiện',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                license_plate: { type: 'string' },
                                vehicle_type: { type: 'string', enum: ['motorbike', 'car', 'bicycle'] },
                                brand: { type: 'string' },
                                color: { type: 'string' },
                                card_number: { type: 'string' },
                                is_active: { type: 'boolean' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Cập nhật thành công' } }
        },
        delete: {
            summary: 'Hủy đăng ký phương tiện (Soft delete)',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Xóa thành công' } }
        }
    },
    '/vehicles/{id}/status': {
        patch: {
            summary: 'Kích hoạt / Tạm dừng phương tiện',
            tags: ['Vehicles'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                is_active: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Cập nhật thành công' } }
        }
    }
}

export const swaggerFeeTypePaths = {
    '/feeType': {
        get: {
            summary: 'Lấy danh sách loại phí',
            tags: ['Fee Types'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                        name: { type: 'string', example: 'Phí quản lý' },
                                        fee_category: { type: 'string', example: 'SERVICE' },
                                        unit_price: { type: 'integer', example: 5000 },
                                        unit: { type: 'string', example: 'm2' },
                                        description: { type: 'string', example: 'Phí dịch vụ quản lý chung cư' },
                                        is_active: { type: 'boolean', example: true }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            summary: 'Thêm mới loại phí',
            tags: ['Fee Types'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Phí quản lý' },
                                fee_category: { type: 'string', example: 'SERVICE' },
                                unit_price: { type: 'integer', example: 5000 },
                                unit: { type: 'string', example: 'm2' },
                                description: { type: 'string', example: 'Phí dịch vụ quản lý chung cư' },
                                is_active: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/feeType/{id}': {
        get: {
            summary: 'Lấy chi tiết loại phí',
            tags: ['Fee Types'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
                200: {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                    name: { type: 'string', example: 'Phí quản lý' },
                                    fee_category: { type: 'string', example: 'SERVICE' },
                                    unit_price: { type: 'integer', example: 5000 },
                                    unit: { type: 'string', example: 'm2' },
                                    description: { type: 'string', example: 'Phí dịch vụ quản lý chung cư' },
                                    is_active: { type: 'boolean', example: true }
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            summary: 'Cập nhật loại phí',
            tags: ['Fee Types'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'Phí quản lý (Cập nhật)' },
                                fee_category: { type: 'string', example: 'SERVICE' },
                                unit_price: { type: 'integer', example: 6000 },
                                unit: { type: 'string', example: 'm2' },
                                description: { type: 'string', example: 'Phí dịch vụ quản lý chung cư sau cập nhật' },
                                is_active: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        },
        delete: {
            summary: 'Xóa loại phí',
            tags: ['Fee Types'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/feeType/{id}/active': {
        put: {
            summary: 'Bật/Tắt trạng thái hoạt động của loại phí',
            tags: ['Fee Types'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        }
    }
}

export const swaggerMaintenanceRequestsPaths = {
    '/maintenancerequests': {
        get: {
            summary: 'Lấy danh sách yêu cầu bảo trì',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            responses: { 200: { description: 'Thành công' } }
        },
        post: {
            summary: 'Tạo yêu cầu bảo trì mới',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                apartment_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                resident_id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                title: { type: 'string', example: 'Hỏng vòi nước' },
                                description: { type: 'string', example: 'Vòi nước bồn rửa mặt bị rò rỉ' },
                                priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'medium' },
                                category: { type: 'string', example: 'Plumbing' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Tạo thành công' } }
        }
    },
    '/maintenancerequests/stats': {
        get: {
            summary: 'Thống kê yêu cầu bảo trì',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
                { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/maintenancerequests/me': {
        get: {
            summary: 'Lấy danh sách yêu cầu của cư dân hiện tại',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/maintenancerequests/{id}': {
        get: {
            summary: 'Lấy chi tiết yêu cầu bảo trì',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Thành công' } }
        },
        put: {
            summary: 'Cập nhật yêu cầu bảo trì',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                description: { type: 'string' },
                                priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                                category: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Cập nhật thành công' } }
        },
        delete: {
            summary: 'Xóa yêu cầu bảo trì',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Xóa thành công' } }
        }
    },
    '/maintenancerequests/{id}/assign': {
        patch: {
            summary: 'Giao yêu cầu cho nhân viên',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                assigned_to: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Giao việc thành công' } }
        }
    },
    '/maintenancerequests/{id}/status': {
        patch: {
            summary: 'Cập nhật trạng thái/tiến độ yêu cầu',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'closed', 'cancelled'], example: 'in_progress' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Cập nhật thành công' } }
        }
    },
    '/maintenancerequests/{id}/close': {
        patch: {
            summary: 'Đóng yêu cầu bảo trì',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {}
                        }
                    }
                }
            },
            responses: { 200: { description: 'Đóng yêu cầu thành công' } }
        }
    },
    '/maintenancerequests/{id}/rate': {
        post: {
            summary: 'Đánh giá yêu cầu bảo trì',
            tags: ['Maintenance Requests'],
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                rating: { type: 'integer', minimum: 1, maximum: 5 },
                                feedback: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Đánh giá thành công' } }
        }
    }
}

export const swaggerMaintenanceSchedulesPaths = {
    '/maintenance-schedules': {
        get: {
            summary: 'Lấy danh sách lịch bảo trì',
            tags: ['Maintenance Schedules'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Tìm kiếm theo tiêu đề' },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'per_page', in: 'query', schema: { type: 'integer', default: 10 } }
            ],
            responses: { 200: { description: 'Thành công' } }
        },
        post: {
            summary: 'Tạo lịch bảo trì mới',
            tags: ['Maintenance Schedules'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                title: { type: 'string', example: 'Bảo trì thang máy' },
                                description: { type: 'string', example: 'Bảo trì định kỳ thang máy tòa A' },
                                frequency: { type: 'string', enum: ['once', 'weekly', 'monthly', 'quarterly', 'yearly'], example: 'monthly' },
                                scheduled_date: { type: 'string', format: 'date-time', example: '2026-05-10T08:00:00.000Z' },
                                assigned_to: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Tạo lịch bảo trì thành công' } }
        }
    },
    '/maintenance-schedules/{id}': {
        get: {
            summary: 'Lấy thông tin chi tiết lịch bảo trì',
            tags: ['Maintenance Schedules'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        },
        put: {
            summary: 'Cập nhật lịch bảo trì',
            tags: ['Maintenance Schedules'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                title: { type: 'string', example: 'Bảo trì thang máy' },
                                description: { type: 'string', example: 'Bảo trì định kỳ thang máy tòa A' },
                                frequency: { type: 'string', enum: ['once', 'weekly', 'monthly', 'quarterly', 'yearly'], example: 'monthly' },
                                scheduled_date: { type: 'string', format: 'date-time', example: '2026-05-10T08:00:00.000Z' },
                                assigned_to: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'], example: 'scheduled' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Cập nhật thành công' } }
        },
        delete: {
            summary: 'Xóa lịch bảo trì',
            tags: ['Maintenance Schedules'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Xóa thành công' } }
        }
    },
    '/maintenance-schedules/{id}/complete': {
        patch: {
            summary: 'Hoàn thành lịch bảo trì',
            tags: ['Maintenance Schedules'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Hoàn thành lịch bảo trì thành công' } }
        }
    }
}

export const swaggerUtilityReadingPaths = {
    '/utilityreading': {
        get: {
            summary: 'Lấy danh sách ghi chỉ số tiện ích',
            tags: ['Utility Reading'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'q', in: 'query', schema: { type: 'string' } },
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'per_page', in: 'query', schema: { type: 'integer', default: 10 } },
                { name: 'apartment_id', in: 'query', schema: { type: 'string' } },
                { name: 'fee_type_id', in: 'query', schema: { type: 'string' } },
                { name: 'reading_month', in: 'query', schema: { type: 'integer' } },
                { name: 'reading_year', in: 'query', schema: { type: 'integer' } }
            ],
            responses: {
                200: {
                    description: 'Thành công'
                }
            }
        },

        post: {
            summary: 'Tạo mới ghi chỉ số tiện ích',
            tags: ['Utility Reading'],
            security: [{ bearerAuth: [] }],

            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                apartment_id: {
                                    type: 'string',
                                    example: '65f0b23c4d5e6f7g8h9i0j1a'
                                },

                                fee_type_id: {
                                    type: 'string',
                                    example: '65f0b23c4d5e6f7g8h9i0j1b'
                                },

                                reading_month: {
                                    type: 'integer',
                                    example: 5
                                },

                                reading_year: {
                                    type: 'integer',
                                    example: 2024
                                },

                                previous_reading: {
                                    type: 'number',
                                    example: 100
                                },

                                current_reading: {
                                    type: 'number',
                                    example: 120
                                },

                                recorded_by: {
                                    type: 'string',
                                    example: '65f0b23c4d5e6f7g8h9i0j1c'
                                }
                            },

                            required: [
                                'apartment_id',
                                'fee_type_id',
                                'reading_month',
                                'reading_year'
                            ]
                        }
                    }
                }
            },

            responses: {
                201: {
                    description: 'Tạo thành công'
                },

                400: {
                    description: 'Dữ liệu không hợp lệ'
                }
            }
        }
    },

    '/utilityreading/{id}': {
        get: {
            summary: 'Lấy chi tiết ghi chỉ số',
            tags: ['Utility Reading'],
            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                }
            ],

            responses: {
                200: {
                    description: 'Thành công'
                },

                404: {
                    description: 'Không tìm thấy'
                }
            }
        },

        put: {
            summary: 'Cập nhật ghi chỉ số',
            tags: ['Utility Reading'],
            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                }
            ],

            requestBody: {
                required: true,

                content: {
                    'application/json': {
                        schema: {
                            type: 'object',

                            properties: {
                                previous_reading: {
                                    type: 'number',
                                    example: 100
                                },

                                current_reading: {
                                    type: 'number',
                                    example: 120
                                },

                                reading_month: {
                                    type: 'integer',
                                    example: 5
                                },

                                reading_year: {
                                    type: 'integer',
                                    example: 2024
                                }
                            }
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: 'Cập nhật thành công'
                },

                400: {
                    description: 'Dữ liệu không hợp lệ'
                },

                404: {
                    description: 'Không tìm thấy'
                }
            }
        },

        delete: {
            summary: 'Xóa ghi chỉ số',
            tags: ['Utility Reading'],
            security: [{ bearerAuth: [] }],

            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                }
            ],

            responses: {
                200: {
                    description: 'Xóa thành công'
                },

                404: {
                    description: 'Không tìm thấy'
                }
            }
        }
    }
}

export const swaggerInvoicesPaths = {
    '/invoices': {
        get: {
            summary: 'Lấy danh sách hóa đơn đa chiều',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'status', in: 'query', schema: { type: 'string' } },
                { name: 'apartment_id', in: 'query', schema: { type: 'string' } },
                { name: 'billing_month', in: 'query', schema: { type: 'integer' } },
                { name: 'billing_year', in: 'query', schema: { type: 'integer' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        },
        post: {
            summary: 'Tạo hóa đơn thủ công',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                apartment_id: { type: 'string' },
                                billing_month: { type: 'integer' },
                                billing_year: { type: 'integer' },
                                details: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            fee_type_id: { type: 'string' },
                                            quantity: { type: 'number' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/invoices/generate': {
        post: {
            summary: 'Tạo hóa đơn hàng loạt',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                billing_month: { type: 'integer' },
                                billing_year: { type: 'integer' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/invoices/generate-monthly': {
        post: {
            summary: 'Tạo hóa đơn hàng loạt (alias)',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                billing_month: { type: 'integer' },
                                billing_year: { type: 'integer' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/invoices/me': {
        get: {
            summary: 'Lấy danh sách hóa đơn của tôi',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/invoices/me/{id}': {
        get: {
            summary: 'Chi tiết hóa đơn của tôi',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/invoices/overdue': {
        get: {
            summary: 'Lấy danh sách hóa đơn quá hạn',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/invoices/{id}': {
        get: {
            summary: 'Chi tiết hóa đơn',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        },
        delete: {
            summary: 'Xóa hóa đơn',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/invoices/{id}/pdf': {
        get: {
            summary: 'Xuất PDF hóa đơn',
            tags: ['Invoices'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        }
    }
}

export const swaggerPaymentsPaths = {
    '/payments/lookup': {
        post: {
            summary: 'Tra cứu thông tin hóa đơn',
            tags: ['Payments'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                invoice_code: { type: 'string', example: 'INV-2024-5-APT1' },
                                apartment_id: { type: 'string', example: '662b2e88a38a7c2e39130001' },
                                billing_month: { type: 'integer', example: 5 },
                                billing_year: { type: 'integer', example: 2024 }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/payments': {
        post: {
            summary: 'Thanh toán hóa đơn',
            tags: ['Payments'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                invoice_id: { type: 'string', example: '662b2e88a38a7c2e39130002' },
                                amount: { type: 'number', example: 500000 },
                                payment_method: { type: 'string', example: 'bank_transfer', description: 'cash | bank_transfer | momo | vnpay' },
                                transaction_code: { type: 'string', example: 'FT24125ABCDE' },
                                note: { type: 'string', example: 'Chuyển khoản thanh toán phí tháng 5' },
                                received_by: { type: 'string', description: 'ID nhân viên thu tiền' }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const swaggerAmenitiesPaths = {
    '/amenities': {
        get: {
            summary: 'Lấy danh sách tiện ích',
            tags: ['Amenities'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                        amenities_code: { type: 'string', example: 'AMN001' },
                                        name: { type: 'string', example: 'Hồ bơi' },
                                        id: { type: 'string', example: 'HB01' },
                                        description: { type: 'string', example: 'Hồ bơi ngoài trời' },
                                        capacity: { type: 'integer', example: 50 },
                                        open_time: { type: 'string', format: 'date-time', example: '2024-01-01T06:00:00.000Z' },
                                        close_time: { type: 'string', format: 'date-time', example: '2024-01-01T22:00:00.000Z' },
                                        is_active: { type: 'boolean', example: true },
                                        created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        },
        post: {
            summary: 'Tạo tiện ích mới',
            tags: ['Amenities'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                amenities_code: { type: 'string', example: 'AMN001' },
                                name: { type: 'string', example: 'Hồ bơi' },
                                id: { type: 'string', example: 'HB01' },
                                description: { type: 'string', example: 'Hồ bơi ngoài trời' },
                                capacity: { type: 'integer', example: 50 },
                                open_time: { type: 'string', format: 'date-time', example: '2024-01-01T06:00:00.000Z' },
                                close_time: { type: 'string', format: 'date-time', example: '2024-01-01T22:00:00.000Z' },
                                is_active: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/amenities/{id}': {
        get: {
            summary: 'Lấy chi tiết tiện ích',
            tags: ['Amenities'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
                200: {
                    description: 'Thành công',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: '65f0b23c4d5e6f7g8h9i0j1k' },
                                    amenities_code: { type: 'string', example: 'AMN001' },
                                    name: { type: 'string', example: 'Hồ bơi' },
                                    id: { type: 'string', example: 'HB01' },
                                    description: { type: 'string', example: 'Hồ bơi ngoài trời' },
                                    capacity: { type: 'integer', example: 50 },
                                    open_time: { type: 'string', format: 'date-time', example: '2024-01-01T06:00:00.000Z' },
                                    close_time: { type: 'string', format: 'date-time', example: '2024-01-01T22:00:00.000Z' },
                                    is_active: { type: 'boolean', example: true },
                                    created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            summary: 'Cập nhật tiện ích',
            tags: ['Amenities'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                amenities_code: { type: 'string', example: 'AMN001' },
                                name: { type: 'string', example: 'Hồ bơi' },
                                id: { type: 'string', example: 'HB01' },
                                description: { type: 'string', example: 'Hồ bơi ngoài trời' },
                                capacity: { type: 'integer', example: 50 },
                                open_time: { type: 'string', format: 'date-time', example: '2024-01-01T06:00:00.000Z' },
                                close_time: { type: 'string', format: 'date-time', example: '2024-01-01T22:00:00.000Z' },
                                is_active: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        },
        delete: {
            summary: 'Xóa tiện ích',
            tags: ['Amenities'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Thành công' } }
        }
    },
    '/amenities/{id}/status': {
        patch: {
            summary: 'Cập nhật trạng thái tiện ích',
            tags: ['Amenities'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                is_active: { type: 'boolean', example: true }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Thành công' } }
        }
    }
}
