import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringFieldOptional } from '../../../decorators';

// TODO, remove this class and use constructor's second argument's type
export type WalletDtoOptions = Partial<{ isActive: boolean }>;

export class WalletDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  address?: string | null;
}
