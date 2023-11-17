import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { CreateSettingsHandler } from './commands/create-settings.command';
import { TenantController } from './tenant.controller';
import { TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantSettingsEntity } from './tenant-settings.entity';

// const handlers = [CreateSettingsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity, TenantSettingsEntity])],
  controllers: [TenantController],
  exports: [TenantService],
  providers: [TenantService],
})
export class TenantModule {}
