import { Injectable } from '@nestjs/common';
import { PrivyClient } from '@privy-io/server-auth';

@Injectable()
export class PrivyService {
  private privyClient;

  constructor() {
    this.privyClient = new PrivyClient('clrpwag8h01twla0f9uckte9d', "3AuGQs5SU5SWcegfAwqdbSNb8keAgdPnPKREYna9iJfqmXHMSqSFiFCgjKCjAyiLPspb7MCyhcvwt3y3sK2jHUzf")
  }

  async getPrivyUsers() {
    return this.privyClient.getUsers();
  }
}
