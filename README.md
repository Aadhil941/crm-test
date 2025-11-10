# Customer Account Management Application

A full-stack customer account management application built with React, Node.js, TypeScript, and PostgreSQL. This application provides a complete CRUD interface for managing customer accounts with proper architecture patterns, type safety, and Docker support.

## 🚀 Quick Access

Once the application is running:
- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **📚 Swagger API Documentation**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **Health Check**: [http://localhost:3001/health](http://localhost:3001/health)

## Architecture Overview

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query for server state + Context API
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM/Query Builder**: Knex.js
- **Architecture**: Repository Pattern + Service Layer
- **Validation**: express-validator

### Database
- **Database**: PostgreSQL 15
- **Migrations**: Knex.js
- **Connection Pooling**: Configured with Knex

### Containerization
- **Docker Compose**: Multi-container setup
- **Services**: PostgreSQL, Backend API, Frontend (Nginx)

## Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── presentation/     # UI components (CustomerTable, CustomerForm, etc.)
│   │   │   └── logic/            # Container components (CustomerListContainer, etc.)
│   │   ├── hooks/                # Custom hooks (useCustomers, etc.)
│   │   ├── context/              # Context providers (ApiContext)
│   │   ├── services/             # API service layer
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # Utility functions
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/          # Route handlers (CustomerController)
│   │   ├── services/             # Business logic layer (CustomerService)
│   │   ├── repositories/         # Data access layer (CustomerRepository)
│   │   ├── models/               # Type definitions
│   │   ├── middleware/           # Express middleware (errorHandler, validation)
│   │   ├── config/               # Configuration (database, env)
│   │   ├── migrations/           # Knex migrations
│   │   └── server.ts             # Entry point
│   ├── Dockerfile
│   ├── knexfile.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+ (if running locally)
- Docker and Docker Compose (for containerized setup)

## Setup Instructions

### Option 1: Local Development Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=customer_accounts
DB_USER=postgres
DB_PASSWORD=postgres
DB_POOL_MIN=2
DB_POOL_MAX=20
API_BASE_URL=http://localhost:3001
```

5. Create the PostgreSQL database:
```bash
createdb customer_accounts
```

6. Run database migrations:
```bash
npm run migrate
```

7. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3001
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Option 2: Docker Setup (Recommended)

#### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose) installed and running
- Docker version 20.10+ and Docker Compose version 2.0+

#### Quick Start (All Services)

1. **Navigate to the project root directory:**
```bash
cd /path/to/project-root
```

2. **Create environment file (optional - defaults are provided):**
   Create a `.env` file in the project root if you want to customize database credentials:
```bash
# .env (optional)
DB_NAME=customer_accounts
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
```

3. **Build and start all services:**
```bash
docker-compose up --build
```

This command will:
- Build Docker images for backend and frontend
- Start PostgreSQL database container
- Start backend API container (runs migrations automatically)
- Start frontend container (served via Nginx)
- Create a Docker network for inter-container communication

4. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`
   - Database: `localhost:5432` (use credentials from `.env` or defaults)

5. **View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

#### Running Individual Services

**Start only the database:**
```bash
docker-compose up postgres
```

**Start backend and database:**
```bash
docker-compose up postgres backend
```

**Start frontend and backend (requires database running):**
```bash
docker-compose up frontend backend
```

#### Managing Docker Services

**Stop all services:**
```bash
docker-compose down
```

**Stop and remove volumes (deletes database data):**
```bash
docker-compose down -v
```

**Rebuild and restart (after code changes):**
```bash
docker-compose up --build --force-recreate
```

**Start in detached mode (background):**
```bash
docker-compose up -d
```

**Restart a specific service:**
```bash
docker-compose restart backend
docker-compose restart frontend
```

#### Docker Development Workflow

**For backend development:**
1. Make changes to backend code
2. Rebuild backend container: `docker-compose up --build backend`
3. Or restart: `docker-compose restart backend`

**For frontend development:**
1. Make changes to frontend code
2. Rebuild frontend container: `docker-compose up --build frontend`
3. Or restart: `docker-compose restart frontend`

**View running containers:**
```bash
docker-compose ps
```

**Execute commands in containers:**
```bash
# Backend container
docker-compose exec backend sh

# Database container
docker-compose exec postgres psql -U postgres -d customer_accounts
```

## Database Migrations

### Running Migrations

**Local Development:**
```bash
cd backend
npm run migrate
```

**Docker:**
Migrations run automatically when the backend container starts.

### Creating New Migrations

```bash
cd backend
npm run migrate:make migration_name
```

### Rolling Back Migrations

```bash
cd backend
npm run migrate:rollback
```

## API Documentation

### Swagger UI (Interactive Documentation)

The API includes **Swagger UI** for interactive API documentation and testing:

- **📚 Swagger UI**: [`http://localhost:3001/api-docs`](http://localhost:3001/api-docs)
- **📄 OpenAPI Spec JSON**: [`http://localhost:3001/api-docs.json`](http://localhost:3001/api-docs.json)
- **📖 Complete API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

The Swagger UI provides:
- ✅ Interactive API testing interface
- ✅ Complete endpoint documentation with request/response examples
- ✅ Schema definitions for all data models
- ✅ Try-it-out functionality to test endpoints directly
- ✅ Real-time request/response validation

### Base URL
- Local: `http://localhost:3001`
- Docker: `http://localhost:3001`

### Endpoints

#### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get All Customers
```
GET /api/customers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "account_id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone_number": "+1234567890",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "date_created": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Customer by ID
```
GET /api/customers/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "account_id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "date_created": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Customer
```
POST /api/customers
Content-Type: application/json

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

**Required Fields:** `first_name`, `last_name`, `email`

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Customer created successfully"
}
```

#### Update Customer
```
PUT /api/customers/:id
Content-Type: application/json

{
  "first_name": "Jane",
  "email": "jane.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Customer updated successfully"
}
```

#### Delete Customer
```
DELETE /api/customers/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

### Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` (400): Validation failed
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict (e.g., duplicate email)
- `INTERNAL_ERROR` (500): Server error

## Features

### Frontend Features
- ✅ Display list of all customer accounts in a table
- ✅ View individual customer details
- ✅ Create new customer accounts with form validation
- ✅ Update existing customer accounts via modal
- ✅ Delete customers with confirmation dialog
- ✅ Loading states and error handling
- ✅ Responsive design with Material-UI
- ✅ Form validation with error messages
- ✅ Performance optimizations (React.memo, useMemo, useCallback)
- ✅ React Query for data caching and background refetching

### Backend Features
- ✅ RESTful API with proper HTTP methods
- ✅ **Swagger/OpenAPI documentation** with interactive UI
- ✅ Repository pattern for data access
- ✅ Service layer for business logic
- ✅ Dependency injection support
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ Centralized logging with Winston
- ✅ Connection pooling for database
- ✅ Environment-based configuration
- ✅ TypeScript for type safety
- ✅ Health check endpoint

### Database Features
- ✅ Proper naming conventions (snake_case)
- ✅ Indexes for performance (email, date_created, name composite)
- ✅ UUID primary keys
- ✅ Timestamps with auto-generation
- ✅ Unique constraint on email

## Development Workflow

### Backend Development

1. Make changes to TypeScript files in `backend/src/`
2. The dev server (`npm run dev`) will automatically restart
3. Run type checking: `npm run type-check`
4. Build for production: `npm run build`

### Frontend Development

1. Make changes to React components in `frontend/src/`
2. Vite will hot-reload automatically
3. Build for production: `npm run build`

### Code Quality

- TypeScript strict mode enabled
- ESLint configured for both frontend and backend
- Consistent code formatting
- Proper error handling throughout

## Testing

### Running Tests (if implemented)

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `psql -l | grep customer_accounts`

### Port Already in Use

- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`
- Database: Change `DB_PORT` in `backend/.env`

### Docker Issues

1. Check container logs: `docker-compose logs [service-name]`
2. Rebuild containers: `docker-compose up --build`
3. Reset volumes: `docker-compose down -v && docker-compose up`

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_POOL_MIN`: Minimum connection pool size
- `DB_POOL_MAX`: Maximum connection pool size

### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API URL

## License

ISC

## Author

Customer Account Management Application


