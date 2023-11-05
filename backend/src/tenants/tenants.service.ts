import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenants.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) {}

  create(name: string, domain: string): Promise<Tenant> {
    const tenant = new Tenant();
    tenant.name = name;
    tenant.domain = domain;
    return this.tenantsRepository.save(tenant);
  }

  findByDomain(domain: string): Promise<Tenant> {
    return this.tenantsRepository.findOne({where: {domain} });
  }
}
