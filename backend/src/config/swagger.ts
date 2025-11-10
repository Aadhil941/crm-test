import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer Account Management API',
      version: '1.0.0',
      description: 'Comprehensive RESTful API for managing customer accounts with full CRUD operations. Built with Node.js, Express, TypeScript, and PostgreSQL.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: env.apiBaseUrl,
        description: 'API Server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints for monitoring server status',
      },
      {
        name: 'Customers',
        description: 'Customer account management operations (CRUD)',
      },
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          required: ['account_id', 'first_name', 'last_name', 'email', 'date_created'],
          properties: {
            account_id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the customer account',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            first_name: {
              type: 'string',
              maxLength: 100,
              description: 'Customer first name',
              example: 'John',
            },
            last_name: {
              type: 'string',
              maxLength: 100,
              description: 'Customer last name',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Customer email address',
              example: 'john.doe@example.com',
            },
            phone_number: {
              type: 'string',
              nullable: true,
              maxLength: 20,
              description: 'Customer phone number',
              example: '+1234567890',
            },
            address: {
              type: 'string',
              nullable: true,
              maxLength: 255,
              description: 'Customer street address',
              example: '123 Main St',
            },
            city: {
              type: 'string',
              nullable: true,
              maxLength: 100,
              description: 'Customer city',
              example: 'New York',
            },
            state: {
              type: 'string',
              nullable: true,
              maxLength: 100,
              description: 'Customer state or province',
              example: 'NY',
            },
            country: {
              type: 'string',
              nullable: true,
              maxLength: 100,
              description: 'Customer country',
              example: 'USA',
            },
            date_created: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the customer account was created',
              example: '2024-01-15T10:30:00Z',
            },
          },
        },
        CreateCustomerInput: {
          type: 'object',
          required: ['first_name', 'last_name', 'email'],
          properties: {
            first_name: {
              type: 'string',
              maxLength: 100,
              description: 'Customer first name',
              example: 'John',
            },
            last_name: {
              type: 'string',
              maxLength: 100,
              description: 'Customer last name',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Customer email address',
              example: 'john.doe@example.com',
            },
            phone_number: {
              type: 'string',
              maxLength: 20,
              description: 'Customer phone number',
              example: '+1234567890',
            },
            address: {
              type: 'string',
              maxLength: 255,
              description: 'Customer street address',
              example: '123 Main St',
            },
            city: {
              type: 'string',
              maxLength: 100,
              description: 'Customer city',
              example: 'New York',
            },
            state: {
              type: 'string',
              maxLength: 100,
              description: 'Customer state or province',
              example: 'NY',
            },
            country: {
              type: 'string',
              maxLength: 100,
              description: 'Customer country',
              example: 'USA',
            },
          },
        },
        UpdateCustomerInput: {
          type: 'object',
          properties: {
            first_name: {
              type: 'string',
              maxLength: 100,
              description: 'Customer first name',
              example: 'John',
            },
            last_name: {
              type: 'string',
              maxLength: 100,
              description: 'Customer last name',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'Customer email address',
              example: 'john.doe@example.com',
            },
            phone_number: {
              type: 'string',
              maxLength: 20,
              description: 'Customer phone number',
              example: '+1234567890',
            },
            address: {
              type: 'string',
              maxLength: 255,
              description: 'Customer street address',
              example: '123 Main St',
            },
            city: {
              type: 'string',
              maxLength: 100,
              description: 'Customer city',
              example: 'New York',
            },
            state: {
              type: 'string',
              maxLength: 100,
              description: 'Customer state or province',
              example: 'NY',
            },
            country: {
              type: 'string',
              maxLength: 100,
              description: 'Customer country',
              example: 'USA',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully',
            },
            count: {
              type: 'number',
              description: 'Number of items returned (for list endpoints)',
              example: 10,
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Error code',
                  example: 'NOT_FOUND',
                },
                message: {
                  type: 'string',
                  description: 'Error message',
                  example: 'Customer not found',
                },
              },
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Validation failed',
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'email',
                      },
                      message: {
                        type: 'string',
                        example: 'Email must be a valid email address',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    // Development paths (TypeScript source files)
    path.join(process.cwd(), 'src/routes/*.ts'),
    path.join(process.cwd(), 'src/server.ts'),
    // Production paths (compiled JavaScript files)
    path.join(process.cwd(), 'dist/routes/*.js'),
    path.join(process.cwd(), 'dist/server.js'),
    // Relative paths as fallback
    './src/routes/*.ts',
    './src/server.ts',
    './dist/routes/*.js',
    './dist/server.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

// Log swagger spec generation status
if (!swaggerSpec || Object.keys(swaggerSpec).length === 0) {
  console.warn('⚠️  Warning: Swagger spec appears to be empty. Check that JSDoc comments are present in route files.');
} else {
  console.log('✅ Swagger spec generated successfully');
  const spec = swaggerSpec as { paths?: Record<string, unknown> };
  console.log(`📚 Found ${spec.paths ? Object.keys(spec.paths).length : 0} documented endpoints`);
}

