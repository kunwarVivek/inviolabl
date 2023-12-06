
## Next.js App with Clerk Authentication

This project is a Next.js application with authentication powered by Clerk. Clerk is a developer-friendly authentication and user management service that makes it easy to add secure login and registration to your applications.

## Getting Started

# Prerequisites

Before you begin, make sure you have the following installed on your machine:

Node.js 18.17 or later.
npm or Yarn

# Install dependencies:

npm install

# Configuration

Create a Clerk account: Clerk Dashboard

Create a Clerk application and note the API Key.

Create a .env file in the root of your project to add clerk api keys:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=Your-clerk-public-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Usage

To start the development server, run:

npm run dev

Visit http://localhost:3000 in your browser to see your app.

# Authentication

Clerk handles authentication seamlessly including login and signup. 

For more details on Clerk, refer to the Clerk Documentation https://clerk.com/docs.

# Deployment
Follow the deployment guidelines for Next.js applications when deploying your app to production.

# Acknowledgments
Next.js
Clerk