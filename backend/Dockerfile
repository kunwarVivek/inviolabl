# Build stage
FROM node:lts-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . ./

# Build the application
RUN yarn build:prod

# Production stage
FROM node:lts-alpine
WORKDIR /usr/src/app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --prod

# Set the default port for the container
ARG PORT=3000
EXPOSE $PORT

# Start the application
CMD [ "yarn", "start:prod" ]
