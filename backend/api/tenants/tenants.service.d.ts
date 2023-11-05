import { Repository } from 'typeorm';
import { Tenant } from './entities/tenants.entity';
export declare class TenantService {
    private tenantsRepository;
    constructor(tenantsRepository: Repository<Tenant>);
    create(name: string, domain: string): Promise<Tenant>;
    findByDomain(domain: string): Promise<Tenant>;
}
