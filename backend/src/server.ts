import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import customerRoutes from './routes/customerRoutes';
import { swaggerSpec } from './config/swagger';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API server is running and healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'ok'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-01-15T10:30:00.000Z'
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/customers', customerRoutes);

// Swagger documentation
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Customer Account Management API',
};

// Swagger UI setup - serve needs to be spread as it returns an array
app.use('/api-docs', ...swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = env.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: env.nodeEnv,
    port: PORT,
  });
});

export default app;


