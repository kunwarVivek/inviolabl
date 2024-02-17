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

  async inviteUserToOrganization(emailAddress: string, organizationId: string, inviterUserId: string, role: string, redirectUrl: string) {
    try {
      await this.clerkClient.organizations.createOrganizationInvitation({
        "organizationId": organizationId,
        "emailAddress":emailAddress,
        "inviterUserId":inviterUserId,
        "role":role,
        "redirectUrl":redirectUrl
      });
      console.log('Invitation sent successfully');
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  }

}
