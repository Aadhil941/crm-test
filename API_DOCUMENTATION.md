# API Documentation

## Overview

The Customer Account Management API provides a comprehensive RESTful interface for managing customer accounts. Built with Node.js, Express, TypeScript, and PostgreSQL, it offers full CRUD (Create, Read, Update, Delete) operations with robust validation and error handling.

## 📚 Interactive Documentation

### Swagger UI

Access the **interactive API documentation** with Swagger UI:

- **URL**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **OpenAPI Spec**: [http://localhost:3001/api-docs.json](http://localhost:3001/api-docs.json)

Swagger UI Features:
- 🔍 Browse all available endpoints
- 📝 View detailed request/response schemas
- 🧪 Test API endpoints directly from your browser
- 📋 Copy example requests
- ✅ Validate responses against schemas

## Base Information

- **Version**: 1.0.0
- **Base URL**: `http://localhost:3001`
- **Content Type**: `application/json`
- **License**: ISC

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

### Success Response

All successful responses follow this format:

```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully",
  "count": 10  // Only for list endpoints
}
```

### Error Response

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Validation Error Response

Validation errors include detailed field-level information:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email must be a valid email address"
      }
    ]
  }
}
```

## Status Codes

- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error or malformed request
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., email already exists)
- `500 Internal Server Error` - Server error

## Endpoints

### Health Check

#### GET /health

Check if the API server is running and healthy.

**Tags**: Health

**Response**: `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Example**:
```bash
curl http://localhost:3001/health
```

---

### Customers

#### GET /api/customers

Retrieve a list of all customers.

**Tags**: Customers

**Response**: `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "account_id": "123e4567-e89b-12d3-a456-426614174000",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone_number": "+1234567890",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "date_created": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Example**:
```bash
curl http://localhost:3001/api/customers
```

---

#### GET /api/customers/:id

Retrieve a specific customer by their account ID.

**Tags**: Customers

**Parameters**:
- `id` (path, required) - Customer account ID (UUID format)

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "account_id": "123e4567-e89b-12d3-a456-426614174000",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "date_created": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:
- `404 Not Found` - Customer with the specified ID does not exist

**Example**:
```bash
curl http://localhost:3001/api/customers/123e4567-e89b-12d3-a456-426614174000
```

---

#### POST /api/customers

Create a new customer account.

**Tags**: Customers

**Request Body** (required):

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA"
}
```

**Required Fields**:
- `first_name` (string, max 100 characters)
- `last_name` (string, max 100 characters)
- `email` (string, valid email format, max 255 characters)

**Optional Fields**:
- `phone_number` (string, max 20 characters)
- `address` (string, max 255 characters)
- `city` (string, max 100 characters)
- `state` (string, max 100 characters)
- `country` (string, max 100 characters)

**Response**: `201 Created`

```json
{
  "success": true,
  "data": {
    "account_id": "123e4567-e89b-12d3-a456-426614174000",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "date_created": "2024-01-15T10:30:00.000Z"
  },
  "message": "Customer created successfully"
}
```

**Error Responses**:
- `400 Bad Request` - Validation error
- `409 Conflict` - Customer with email already exists

**Example**:
```bash
curl -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890"
  }'
```

---

#### PUT /api/customers/:id

Update an existing customer's information.

**Tags**: Customers

**Parameters**:
- `id` (path, required) - Customer account ID (UUID format)

**Request Body** (at least one field required):

```json
{
  "first_name": "Jane",
  "email": "jane.doe@example.com",
  "city": "Los Angeles"
}
```

**Updatable Fields** (all optional, but at least one required):
- `first_name` (string, max 100 characters)
- `last_name` (string, max 100 characters)
- `email` (string, valid email format, max 255 characters)
- `phone_number` (string, max 20 characters)
- `address` (string, max 255 characters)
- `city` (string, max 100 characters)
- `state` (string, max 100 characters)
- `country` (string, max 100 characters)

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "account_id": "123e4567-e89b-12d3-a456-426614174000",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane.doe@example.com",
    "phone_number": "+1234567890",
    "address": "123 Main St",
    "city": "Los Angeles",
    "state": "NY",
    "country": "USA",
    "date_created": "2024-01-15T10:30:00.000Z"
  },
  "message": "Customer updated successfully"
}
```

**Error Responses**:
- `400 Bad Request` - Validation error
- `404 Not Found` - Customer with the specified ID does not exist
- `409 Conflict` - Email already exists for another customer

**Example**:
```bash
curl -X PUT http://localhost:3001/api/customers/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "city": "Los Angeles"
  }'
```

---

#### DELETE /api/customers/:id

Delete a customer account.

**Tags**: Customers

**Parameters**:
- `id` (path, required) - Customer account ID (UUID format)

**Response**: `200 OK`

```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

**Error Responses**:
- `404 Not Found` - Customer with the specified ID does not exist

**Example**:
```bash
curl -X DELETE http://localhost:3001/api/customers/123e4567-e89b-12d3-a456-426614174000
```

---

## Data Models

### Customer

The complete customer object with all fields:

```typescript
{
  account_id: string;      // UUID, auto-generated
  first_name: string;      // Required, max 100 chars
  last_name: string;       // Required, max 100 chars
  email: string;           // Required, unique, valid email, max 255 chars
  phone_number?: string;   // Optional, max 20 chars
  address?: string;        // Optional, max 255 chars
  city?: string;           // Optional, max 100 chars
  state?: string;          // Optional, max 100 chars
  country?: string;        // Optional, max 100 chars
  date_created: string;    // ISO 8601 datetime, auto-generated
}
```

### CreateCustomerInput

Fields for creating a new customer:

```typescript
{
  first_name: string;      // Required, max 100 chars
  last_name: string;       // Required, max 100 chars
  email: string;           // Required, valid email, max 255 chars
  phone_number?: string;   // Optional, max 20 chars
  address?: string;        // Optional, max 255 chars
  city?: string;           // Optional, max 100 chars
  state?: string;          // Optional, max 100 chars
  country?: string;        // Optional, max 100 chars
}
```

### UpdateCustomerInput

Fields for updating a customer (all optional, but at least one required):

```typescript
{
  first_name?: string;     // Optional, max 100 chars
  last_name?: string;      // Optional, max 100 chars
  email?: string;          // Optional, valid email, max 255 chars
  phone_number?: string;   // Optional, max 20 chars
  address?: string;        // Optional, max 255 chars
  city?: string;           // Optional, max 100 chars
  state?: string;          // Optional, max 100 chars
  country?: string;        // Optional, max 100 chars
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `NOT_FOUND` | 404 | Requested resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate email) |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Validation Rules

### Email
- Must be a valid email format
- Maximum 255 characters
- Must be unique across all customers
- Automatically normalized (lowercase, trimmed)

### Names (First Name, Last Name)
- Required for creation
- Maximum 100 characters
- Automatically trimmed

### Phone Number
- Optional
- Maximum 20 characters
- No format validation (supports international formats)

### Address Fields (Address, City, State, Country)
- All optional
- Address: Maximum 255 characters
- City, State, Country: Maximum 100 characters each
- Automatically trimmed

## Rate Limiting

Currently, there is no rate limiting implemented. All endpoints can be called without restrictions.

## CORS

CORS is enabled for all origins. You can make requests from any domain.

## Testing with cURL

Here are complete examples for testing all endpoints:

```bash
# Health check
curl http://localhost:3001/health

# Get all customers
curl http://localhost:3001/api/customers

# Get specific customer
curl http://localhost:3001/api/customers/YOUR_CUSTOMER_ID

# Create a customer
curl -X POST http://localhost:3001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA"
  }'

# Update a customer
curl -X PUT http://localhost:3001/api/customers/YOUR_CUSTOMER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "city": "Los Angeles"
  }'

# Delete a customer
curl -X DELETE http://localhost:3001/api/customers/YOUR_CUSTOMER_ID
```

## Testing with Postman

Import the OpenAPI specification into Postman:

1. Open Postman
2. Click "Import"
3. Select "Link"
4. Enter: `http://localhost:3001/api-docs.json`
5. Postman will automatically create a collection with all endpoints

## Additional Resources

- **OpenAPI Specification**: [OpenAPI 3.0](https://swagger.io/specification/)
- **Swagger UI Documentation**: [Swagger UI](https://swagger.io/tools/swagger-ui/)
- **Project Repository**: See README.md for full project documentation

## Support

For issues, questions, or contributions, please contact API Support at support@example.com

---

**Last Updated**: November 9, 2025  
**API Version**: 1.0.0

