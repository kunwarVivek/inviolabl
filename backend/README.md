
## NestJs Backend with PostgreSQL

This project is a backend application built with NestJS framework and uses PostgreSQL as the database and clerk-sdk to handle clerk frontend accounts user details and organizations. It provides a robust and scalable foundation for building modern web applications.

## Getting Started

# Prerequisites

Before you begin, make sure you have the following installed on your machine:

Node.js
npm or Yarn
PostgreSQL database server

# Install dependencies:

yarn

# Configuration

Create a .env file in the root of your project and configure the PostgreSQL database connection:

DATABASE_HOST=your-postgres-host
DATABASE_PORT=your-postgres-port
DATABASE_USERNAME=your-postgres-username
DATABASE_PASSWORD=your-postgres-password
DATABASE_NAME=your-postgres-database

CLERK_SECRET_KEY=your-clerk-next-frontend-secret-key

# Usage

To start the development server, run:

yarn start:dev

Visit http://localhost:3001 in your browser to see your app.

check the api's and test it in postman or any other tool to further use it.

please note that for every api call, you need to pass active Session-id in the request header with key as "Session-id" from frontend. It will be authenticated here in the backend using clerk-sdk-node. Both frontend and backend are connected with clerk using CLERK_SECRET_KEY.

you can get the session id of the user from the console of the frontend.

# Project Structure

src/: Contains the NestJS application code.
src/modules/: NestJS modules with controllers, services, and other related files.
src/database/: Database-related files, including migrations.
src/main.ts: Entry point for the application.

# Learn More

To learn more about NestJS, take a look at the NestJS Documentation https://docs.nestjs.com/.
