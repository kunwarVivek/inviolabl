// src/tenant/middleware/tenant.middleware.ts

import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { TenantService } from '../tenants.service';
import { RequestWithTenant } from '../interfaces/request.interface';  // Import your custom interface

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: RequestWithTenant, res: Response, next: NextFunction) {  // Use RequestWithTenant here
    const domain = req.hostname;
    console.log("domain",domain)
    const tenant = await this.tenantService.findByDomain(domain);
    if (!tenant) {
      throw new BadRequestException('Invalid tenant');
    }
    req.tenant = tenant;
    next();
  }
}
