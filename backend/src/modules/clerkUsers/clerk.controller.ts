import { Controller, Get } from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Controller('clerk')
export class ClerkController {
  constructor(private readonly clerkService: ClerkService) {}

  @Get('users')
  async getClerkUsers(): Promise<any> {
    try {
      const clerkUsers = await this.clerkService.getClerkUsers();
      return { clerkUsers };
    } catch (error) {
      console.error('Error retrieving Clerk users:', error);
      return { error: 'Internal Server Error' };
    }
  }
}
