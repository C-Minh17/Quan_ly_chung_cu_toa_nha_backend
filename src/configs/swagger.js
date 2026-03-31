import swaggerUi from 'swagger-ui-express'
// import { swaggerUserPaths, swaggerAdminPaths } from './swagger.configs'
import { swaggerUserPaths, swaggerBuildingPaths, swaggerFloorPaths } from './swagger.configs'

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Combined API documentation for User and Admin Modules',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3456}`,
            description: 'Local Server',
        }
    ],
    paths: {
        ...swaggerUserPaths,
        ...swaggerBuildingPaths,
        ...swaggerFloorPaths,
        // ...swaggerAdminPaths
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
    // Expose JSON config — tự detect host từ request
    app.get('/docs/swagger.json', (req, res) => {
        const protocol = req.protocol  // http hoặc https
        const host = req.get('host')   // 192.168.7.100:3456

        const dynamicDoc = {
            ...swaggerDocument,
            servers: [
                {
                    url: `${protocol}://${host}`,
                    description: 'Current Server',
                }
            ]
        }
        res.json(dynamicDoc)
    })

    const options = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            url: '/docs/swagger.json'
        }
    }

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))
}
