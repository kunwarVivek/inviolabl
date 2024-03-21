# Stage 1: Building the application
FROM node:lts-alpine AS dist
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install 

# Copy the rest of your app's source code
COPY . ./

# Build the application
RUN yarn build:prod

# Stage 2: Building the node_modules for production
FROM node:lts-alpine AS node_modules
WORKDIR /app

COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install 

# Stage 3: Run the application
FROM node:lts-alpine

# Create a non-root user and set directory permissions
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# Set working directory
WORKDIR /usr/src/app

# Switch to non-root user
USER node

# Copy built assets from the dist stage
COPY --from=dist --chown=node:node /app/dist ./dist

# Copy node_modules from the node_modules stage
COPY --from=node_modules --chown=node:node /app/node_modules ./node_modules

# Copy application files
COPY --chown=node:node . .

# Set the environment variable for the port
ARG PORT=3001
ENV PORT=$PORT

# Expose the port
EXPOSE 3001

# Define the command to run the app
CMD ["yarn", "start:prod"]
