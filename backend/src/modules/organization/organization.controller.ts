
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Organization } from './organization.entity';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@Body('name') name: string, @Body('gasPolicy') gasPolicy: string): Promise<Organization> {
    return this.organizationService.create({ name, gasPolicy });
  }

  @Get()
  async findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.findById(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Organization> {
    return this.organizationService.findByName(name);
  }
}
