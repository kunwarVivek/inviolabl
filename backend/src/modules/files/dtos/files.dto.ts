
import { PrimaryColumn } from 'typeorm';
import { StringFieldOptional } from '../../../decorators';
import { AddressEntity } from '../address.entity';
import { CidEntity } from '../cid.entity';

// TODO, remove this class and use constructor's second argument's type
export type FilesDtoOptions = Partial<{ isActive: boolean }>;

export class FilesDto  {

  @PrimaryColumn()
  id?: Uuid;

  @StringFieldOptional({ nullable: true })
  email?: string | null;

  addresses?: AddressEntity[];

  cids?: CidEntity[];
}
