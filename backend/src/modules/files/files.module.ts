import { Module } from '@nestjs/common';

import { FilesController } from './files.controller'; // Make sure to import the controller
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesEntity } from './files.entity';
import { AddressEntity } from './address.entity';
import { CidEntity } from './cid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilesEntity,AddressEntity,CidEntity]),
  ],
  controllers: [FilesController], 
  providers: [FilesService],
})
export class FilesModule {}

