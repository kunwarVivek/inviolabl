import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
// import { PostEntity } from '../post/post.entity';
import { TenantDto, type TenantDtoOptions } from './dtos/tenant.dto';
import { TenantSettingsEntity } from './tenant-settings.entity';

@Entity({ name: 'tenants' })
@UseDto(TenantDto)
export class TenantEntity extends AbstractEntity<TenantDto, TenantDtoOptions> {
  @Column({ nullable: false, type: 'varchar' })
  name!: string;

  @Column({ nullable: false, type: 'varchar' })
  domain!: string;

  @OneToOne(
    () => TenantSettingsEntity,
    (tenantSettings) => tenantSettings.tenant,
  )
  settings?: TenantSettingsEntity;

  // @OneToMany(() => PostEntity, (postEntity) => postEntity.tenant)
  // posts?: PostEntity[];
}
