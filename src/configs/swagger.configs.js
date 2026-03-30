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