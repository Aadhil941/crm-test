FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY knexfile.js ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies) for migrations
# We need ts-node and typescript for running TypeScript migrations
RUN npm ci

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/knexfile.js ./knexfile.js
COPY --from=builder /app/src/migrations ./src/migrations

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
