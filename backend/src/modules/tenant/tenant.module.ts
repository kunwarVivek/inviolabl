import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { CreateSettingsHandler } from './commands/create-settings.command';
import { TenantController } from './tenant.controller';
import { TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantSettingsEntity } from './tenant-settings.entity';

import { FileService } from '../fileUpload/file.service';
import { FileEntity } from '../fileUpload/file.entity';

// const handlers = [CreateSettingsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity, TenantSettingsEntity,FileEntity])],
  controllers: [TenantController],
  exports: [TenantService],
  providers: [TenantService, FileService],
})
export class TenantModule {}
