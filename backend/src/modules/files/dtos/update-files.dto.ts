import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { AddressEntity } from '../address.entity';
import { CidEntity } from '../cid.entity';

export class UpdateFIlesDto {

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/, {
    message: 'Email must be unique and in a valid format.',
  })
  email!: string;
  
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  // @Matches(/^[a-zA-Z0-9\-]+$/, { message: 'Domain must be unique and contain only alphanumeric characters and hyphens.' })
  addresses!: AddressEntity[];

  
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  cids!: CidEntity[];
  
}
