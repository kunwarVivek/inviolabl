import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { CreateSettingsHandler } from './commands/create-settings.command';

import { FileEntity } from '../fileUpload/file.entity';
import { FileService } from '../fileUpload/file.service';


// const handlers = [CreateSettingsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  exports: [FileService],
  providers: [FileService],
})
export class FIleModule {}
