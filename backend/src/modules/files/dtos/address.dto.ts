import { AbstractDto } from '../../../common/dto/abstract.dto';

export type AddressDtoOptions = Partial<{ isActive: boolean }>;

export class AddressDto extends AbstractDto {
  
  address?: string | null;

}
