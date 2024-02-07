import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';


import { UseDto } from '../../decorators';
// import { PostEntity } from '../post/post.entity';
import { FilesDto } from './dtos/files.dto';
import { AddressEntity } from './address.entity';
import { CidEntity } from './cid.entity';

@Entity({ name: 'filesCid' })
@UseDto(FilesDto)
export class FilesEntity {

  @PrimaryColumn()
  id!:Uuid

  @Column({ unique: true, type: 'varchar' })
  email!: string;

  @OneToMany(() => AddressEntity, address => address.files)
  @JoinColumn()
  addresses!: AddressEntity[];

  @OneToMany(() => CidEntity, cid => cid.files)
  @JoinColumn()
  cids!: CidEntity[];

}
