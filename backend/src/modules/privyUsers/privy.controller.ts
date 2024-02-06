import { Controller, Get } from '@nestjs/common';
import { PrivyService } from './privy.service';

@Controller('privy')
export class PrivyController {
  constructor(private readonly privyService: PrivyService) {}

  @Get('users')
  async getPrivyUsers(): Promise<any> {
    try {
      const privyUsers = await this.privyService.getPrivyUsers();
      return { privyUsers };
    } catch (error) {
      console.error('Error retrieving Clerk users:', error);
      return { error: 'Internal Server Error' };
    }
  }
}
