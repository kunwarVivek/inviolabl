import { Request } from 'express';
import { Tenant } from '../entities/tenants.entity';
export interface RequestWithTenant extends Request {
    tenant: Tenant;
}
