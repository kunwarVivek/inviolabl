import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { type FileEntity } from 'modules/fileUpload/file.entity';

import { UUIDParam } from '../../decorators';
import { FileService } from '../fileUpload/file.service';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { type TenantDto } from './dtos/tenant.dto';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import { type TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly fileService: FileService,
  ) {}

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

  @Post('/files')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('email') email: string,
    @Body('domainId') domainId: string,
  ) {
    const tenant = await this.tenantService.getTenantIdByDomain(domainId);

    if (tenant) {
      return this.fileService.uploadFiles(files, email, domainId);
    }

    throw new NotFoundException('Tenant not found');
  }

  @Get(':domainId/files')
  getFilesByDomainId(
    @Param('domainId') domainId: string,
  ): Promise<FileEntity[]> {
    return this.fileService.getFilesByDomainId(domainId);
  }

  @Get('/files')
  getAllFiles(): Promise<FileEntity[]> {
    return this.fileService.getAllFiles();
  }
}
