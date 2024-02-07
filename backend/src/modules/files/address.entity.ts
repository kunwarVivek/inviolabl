import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { FilesEntity } from './files.entity';
import { AddressDto, AddressDtoOptions } from './dtos/address.dto';

@Entity({ name: 'addresses' })
export class AddressEntity extends AbstractEntity<AddressDto, AddressDtoOptions> {
  @Column({ type: 'varchar' })
  address!: string;

  @ManyToOne(() => FilesEntity, files => files.addresses)
  files!: FilesEntity;
}
