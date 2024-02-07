import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { FilesService } from './files.service';
import { FilesEntity } from './files.entity';
import { FilesDto } from './dtos/files.dto';

@Controller('filesCid')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post()
  async create(@Body() filesDto: FilesDto): Promise<FilesEntity> {
    return await this.filesService.create(filesDto);
  }

  @Get(':email')
  async findOneByEmail(@Param('email') email: string): Promise<FilesEntity> {
    return await this.filesService.findOneByEmail(email);
  }

  @Post(':email/addresses')
  async addAddress(@Param('email') email: string, @Body('address') address: string): Promise<FilesEntity> {
    return await this.filesService.addAddress(email, address);
  }

  @Post(':email/cids')
  async addCid(@Param('email') email: string, @Body('cid') cid: string): Promise<FilesEntity> {
    return await this.filesService.addCid(email, cid);
  }

  @Delete(':email/cids/:cid')
  async removeCid(@Param('email') email: string, @Param('cid') cid: string): Promise<FilesEntity> {
    return await this.filesService.removeCid(email, cid);
  }

  @Post(':senderEmail/share-cid/:recipientEmail/:cid')
  async shareCid(
    @Param('senderEmail') senderEmail: string,
    @Param('recipientEmail') recipientEmail: string,
    @Param('cid') cid: string
  ): Promise<void> {
    await this.filesService.shareCid(senderEmail, recipientEmail, cid);
  }

}
