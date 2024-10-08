import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  VirtualColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../constants';
import { UseDto } from '../../decorators';
import { PostEntity } from '../post/post.entity';
import { TenantEntity } from '../tenant/tenant.entity';
import { UserDto, type UserDtoOptions } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Column({
    nullable: true,
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role!: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.users)
  @JoinColumn({ name: 'tenantId' }) // This is the foreign key
  tenant!: TenantEntity;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @OneToMany(() => PostEntity, (postEntity) => postEntity.user)
  posts?: PostEntity[];
}
