import swaggerUi from 'swagger-ui-express'
import { swaggerUserPaths, swaggerAdminPaths } from './swagger.configs'

const userSwaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'User API',
        version: '1.0.0',
        description: 'API documentation for User Module',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3456}`,
            description: 'Local Server',
        }
    ],
    paths: {
        ...swaggerUserPaths
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
}

const adminSwaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Admin API',
        version: '1.0.0',
        description: 'API documentation for Admin Module',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3456}`,
            description: 'Local Server',
        }
    ],
    paths: {
        ...swaggerAdminPaths
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
}

export const setupSwagger = (app) => {
    // Expose JSON configs
    app.get('/api-docs/user/swagger.json', (req, res) => res.json(userSwaggerDocument))
    app.get('/api-docs/admin/swagger.json', (req, res) => res.json(adminSwaggerDocument))

    const userOptions = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            url: '/api-docs/user/swagger.json'
        }
    }

    const adminOptions = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            url: '/api-docs/admin/swagger.json'
        }
    }

    app.use('/api-docs/user', swaggerUi.serveFiles(userSwaggerDocument, userOptions), swaggerUi.setup(userSwaggerDocument, userOptions))
    app.use('/api-docs/admin', swaggerUi.serveFiles(adminSwaggerDocument, adminOptions), swaggerUi.setup(adminSwaggerDocument, adminOptions))
}
