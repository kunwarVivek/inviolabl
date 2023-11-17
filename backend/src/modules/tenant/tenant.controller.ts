import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UUIDParam } from '../../decorators';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { type TenantDto } from './dtos/tenant.dto';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import { type TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() createUserDto: CreateTenantDto): Promise<TenantEntity> {
    return this.tenantService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<TenantEntity[]> {
    return this.tenantService.findAll();
  }

  @Get(':id')
  getUser(@UUIDParam('id') userId: Uuid): Promise<TenantDto> {
    return this.tenantService.getTenant(userId);
  }

  @Patch(':id')
  update(@Param('id') id: Uuid, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantService.updateTenant(id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tenantService.remove(id);
  }

  @Get('/by-domain/:domain')
  getTenantIdByDomain(@Param('domain') domain: string): Promise<string | null> {
    return this.tenantService.getTenantIdByDomain(domain);
  }
}
