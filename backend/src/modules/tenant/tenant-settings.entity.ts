import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { TenantDto, type TenantDtoOptions } from './dtos/tenant.dto';
import { TenantEntity } from './tenant.entity';

@Entity({ name: 'tenant_settings' })
@UseDto(TenantDto)
export class TenantSettingsEntity extends AbstractEntity<
  TenantDto,
  TenantDtoOptions
> {
  @Column({ type: 'uuid' })
  tenantId?: string;

  @OneToOne(() => TenantEntity, (tenant) => tenant.settings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: TenantEntity;
}
