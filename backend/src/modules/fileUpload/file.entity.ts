import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { TenantEntity } from '../tenant/tenant.entity';

@Entity({ name: 'files' })
export class FileEntity extends AbstractEntity<any, any> {
  @Column({ type: 'varchar' })
  fileName!: string;

  @Column({ type: 'bytea' })
  data?: Buffer;

  @Column({ type: 'varchar' })
  uploadedBy!: string;

  @Column({ type: 'varchar' })
  domainId!: string;

  @Column({ type: 'int' }) // Adjust the type accordingly
  fileSize!: number;

  @Column({ type: 'varchar' })
  email!: string;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.files)
  @JoinColumn({ name: 'tenantId' })
  tenant!: TenantEntity;
}
