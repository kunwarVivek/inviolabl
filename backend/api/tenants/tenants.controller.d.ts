import { TenantService } from './tenants.service';
import { Tenant } from './entities/tenants.entity';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    create(createTenantDto: {
        name: string;
        domain: string;
    }): Promise<Tenant>;
}
