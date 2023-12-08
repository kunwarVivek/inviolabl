
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

# Connecting Wallet

There are many ways to make requests to the Ethereum chain. For simplicity, we’ll use a free account on Alchemy, a blockchain developer platform, and API that allows us to communicate with the Ethereum chain without running our own nodes.

Create an Alchemy account, you can generate an API key by creating an app.

Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software. It helps developers build smart contracts and dApps locally before deploying to the live chain.

Ethers.js is a library that makes it easier to interact and make requests to Ethereum by wrapping standard JSON-RPC methods with more user-friendly methods.

Hardhat makes it super easy to integrate Plugins for additional tooling and extended functionality. We’ll be taking advantage of the Ethers plugin for contract deployment (Ethers.js has some super clean contract deployment methods).

Update your hardhat.config.js file with your Alchemy Api url inside blockchain directory inside project root.

To deploy our smart contract, navigate to the command line from the root directory of the blockchain project and run the following command: npx hardhat run scripts/deploy.js --network sepolia and your contract will be deployed.

When each user is connecting their wallet, their public address will be stored in the database under our smart contract and we can monitor the each transactions in alchemy application we created.

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