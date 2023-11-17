import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringFieldOptional } from '../../../decorators';
import { type TenantEntity } from '../tenant.entity';

// TODO, remove this class and use constructor's second argument's type
export type TenantDtoOptions = Partial<{ isActive: boolean }>;

export class TenantDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  name?: string | null;

  @StringFieldOptional({ nullable: true })
  domain?: string | null;

  constructor(tenant: TenantEntity) {
    super(tenant);
    this.name = tenant.name;
    this.domain = tenant.domain;
  }
}
