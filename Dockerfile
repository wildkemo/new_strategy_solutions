# Stage 1: Build
FROM node:20-alpine AS builder

# Set working dir
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all project files
COPY . .

# Build Next.js
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy built files + package.json
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/next.config.mjs ./

# Install only prod deps
RUN npm ci --omit=dev

# Expose default Next.js port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
