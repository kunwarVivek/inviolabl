import { NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { TenantService } from '../tenants.service';
import { RequestWithTenant } from '../interfaces/request.interface';
export declare class TenantMiddleware implements NestMiddleware {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    use(req: RequestWithTenant, res: Response, next: NextFunction): Promise<void>;
}
