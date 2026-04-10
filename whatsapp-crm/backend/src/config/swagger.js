export const setupSwagger = async (app) => {
  const { default: swaggerJsdoc } = await import('swagger-jsdoc')
  const { default: swaggerUi } = await import('swagger-ui-express')

  const spec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: process.env.API_NAME ?? 'icmern API',
        version: process.env.API_VERSION ?? '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/api/*.js'],
  })

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
}
