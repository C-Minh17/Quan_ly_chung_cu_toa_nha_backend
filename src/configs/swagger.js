import swaggerUi from 'swagger-ui-express'
// import { swaggerUserPaths, swaggerAdminPaths } from './swagger.configs'
import { swaggerUserPaths, swaggerBuildingPaths, swaggerFloorPaths, swaggerApartmentPaths } from './swagger.configs'

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
        ...swaggerApartmentPaths,
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
    // Expose JSON config
    app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDocument))

    const options = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            url: '/api-docs/swagger.json'
        }
    }

    app.use('/api-docs', swaggerUi.serveFiles(swaggerDocument, options), swaggerUi.setup(swaggerDocument, options))
}
