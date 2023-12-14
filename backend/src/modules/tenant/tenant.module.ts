import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClerkSessionMiddleware } from '../../middleware/middleware';
import { FileEntity } from '../fileUpload/file.entity';
import { FileService } from '../fileUpload/file.service';
// import { CreateSettingsHandler } from './commands/create-settings.command';
import { TenantController } from './tenant.controller';
import { TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantSettingsEntity } from './tenant-settings.entity';

// const handlers = [CreateSettingsHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantEntity, TenantSettingsEntity, FileEntity]),
  ],
  controllers: [TenantController],
  exports: [TenantService],
  providers: [TenantService, FileService],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the ClerkSessionMiddleware to all routes or specific routes
    consumer.apply(ClerkSessionMiddleware).forRoutes('tenants'); // Add your route path
  }
}
