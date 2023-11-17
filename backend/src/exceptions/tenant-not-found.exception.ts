import { NotFoundException } from '@nestjs/common';

export class TenantNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.tenantNotFound', error);
  }
}
