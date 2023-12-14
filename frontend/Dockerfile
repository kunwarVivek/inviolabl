# Stage 1: Building the application
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of your app's source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Run the app as a non-root user for security
USER node

# Define the command to run the app
CMD ["npm", "start"]
