// tenant.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TenantService } from './tenants.service';
import { Tenant } from './entities/tenants.entity';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() createTenantDto: { name: string; domain: string }): Promise<Tenant> {
    return this.tenantService.create(createTenantDto.name, createTenantDto.domain);
  }
}
