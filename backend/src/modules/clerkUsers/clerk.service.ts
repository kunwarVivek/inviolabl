import { Injectable } from '@nestjs/common';
import Clerk from '@clerk/clerk-sdk-node/esm/instance';

@Injectable()
export class ClerkService {
  private clerkClient;

  constructor() {
    this.clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
  }

  async getClerkUsers() {
    return this.clerkClient.users.getUserList();
  }
}
