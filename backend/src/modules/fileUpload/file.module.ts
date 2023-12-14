import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClerkSessionMiddleware } from '../../middleware/middleware';
// import { CreateSettingsHandler } from './commands/create-settings.command';
import { FileEntity } from '../fileUpload/file.entity';
import { FileService } from '../fileUpload/file.service';

// const handlers = [CreateSettingsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  exports: [FileService],
  providers: [FileService],
})
export class FileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the ClerkSessionMiddleware to all routes or specific routes
    consumer.apply(ClerkSessionMiddleware).forRoutes('/tenants/files'); // Add your route path
  }
}
