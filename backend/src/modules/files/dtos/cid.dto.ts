import { AbstractDto } from '../../../common/dto/abstract.dto';


// TODO, remove this class and use constructor's second argument's type
export type CidDtoOptions = Partial<{ isActive: boolean }>;

export class CidDto extends AbstractDto {
  
  
  address?: string | null;

}
