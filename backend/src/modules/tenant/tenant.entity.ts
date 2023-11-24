import { Column, Entity, OneToMany, OneToOne  } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
// import { PostEntity } from '../post/post.entity';
import { TenantDto, type TenantDtoOptions } from './dtos/tenant.dto';
import { TenantSettingsEntity } from './tenant-settings.entity';
import { UserEntity } from '../user/user.entity';


@Entity({ name: 'tenants' })
@UseDto(TenantDto)
export class TenantEntity extends AbstractEntity<TenantDto, TenantDtoOptions> {

  @Column({ nullable: true, type: 'varchar' })
  name!: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  domain!: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @OneToOne(
    () => TenantSettingsEntity,
    (tenantSettings) => tenantSettings.tenant,
  )
  settings?: TenantSettingsEntity;

  @OneToMany(() => UserEntity, (user) => user.tenant)
  users!: UserEntity[];

}
