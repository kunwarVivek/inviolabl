import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TenantNotFoundException } from '../../exceptions/tenant-not-found.exception';
import { type CreateTenantDto } from './dtos/create-tenant.dto';
import { type UpdateTenantDto } from './dtos/update-tenant.dto';
import { TenantEntity } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  create(createUserDto: CreateTenantDto): Promise<TenantEntity> {
    const tenant = new TenantEntity();
    tenant.name = createUserDto.name;
    tenant.domain = createUserDto.domain;

    return this.tenantRepository.save(tenant);
  }

  async findAll(): Promise<TenantEntity[]> {
    return this.tenantRepository.find();
  }

  async remove(id: string): Promise<void> {
    await this.tenantRepository.delete(id);
  }

  // In TenantService

async getTenantIdByDomain(domain: string): Promise<string | null> {
  const tenant = await this.tenantRepository.findOne({ where: { domain } });
  return tenant ? tenant.id : null;
}


  async getTenant(tenantId: Uuid): Promise<TenantEntity> {
    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');

    queryBuilder.where('tenant.id = :tenantId', { tenantId });

    const tenantEntity = await queryBuilder.getOne();

    if (!tenantEntity) {
      throw new TenantNotFoundException();
    }

    return tenantEntity;
  }

  updateTenant(
    id: Uuid,
    updateTenantDto: UpdateTenantDto,
  ): Promise<TenantEntity> {
    const tenant: TenantEntity = new TenantEntity();
    tenant.name = updateTenantDto.name;
    tenant.domain = updateTenantDto.domain;
    tenant.id = id;

    return this.tenantRepository.save(tenant);
  }
}
