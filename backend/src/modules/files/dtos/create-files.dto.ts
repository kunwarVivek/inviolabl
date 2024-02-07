import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { AddressEntity } from '../address.entity';
import { CidEntity } from '../cid.entity';

export class CreateFilesDto {

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/, {
    message: 'Email must be unique and in a valid format.',
  })
  email!: string;
  
  @IsNotEmpty()
  // @Matches(/^[a-zA-Z0-9\-]+$/, { message: 'Domain must be unique and contain only alphanumeric characters and hyphens.' })
  addresses!: AddressEntity[];

  @IsNotEmpty()
  // @Matches(/^[a-zA-Z0-9\-]+$/, { message: 'Domain must be unique and contain only alphanumeric characters and hyphens.' })
  cids!: CidEntity[];
  
}
