import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { FilesEntity } from './files.entity';
import { CidDto, CidDtoOptions } from './dtos/cid.dto';

@Entity({ name: 'cids' })
export class CidEntity extends AbstractEntity<CidDto, CidDtoOptions> {
  @Column({ unique: true, type: 'varchar' })
  cid!: string;

  @ManyToMany(() => FilesEntity, files => files.cids)
  files!: FilesEntity[];
}

