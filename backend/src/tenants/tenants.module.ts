// tenant.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenants.controller';
import { TenantService } from './tenants.service';
import { Tenant } from './entities/tenants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],  // Import TypeOrmModule with Tenant entity
  controllers: [TenantController],  // Declare TenantController
  providers: [TenantService],  // Declare TenantService
  exports: [TenantService],  // Optionally export TenantService for use in other modules
})
export class TenantModule {}
