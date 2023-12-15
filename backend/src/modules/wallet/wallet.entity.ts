import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
// import { PostEntity } from '../post/post.entity';
import { WalletDto, type WalletDtoOptions } from './dtos/wallet.dto';

@Entity({ name: 'wallets' })
@UseDto(WalletDto)
export class WalletEntity extends AbstractEntity<WalletDto, WalletDtoOptions> {
  @Column({ nullable: true, type: 'varchar' })
  email!: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  address!: string;

}
