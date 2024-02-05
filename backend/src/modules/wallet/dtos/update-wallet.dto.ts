import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdateWalletDto {

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
  address!: string;

  
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  cid!: string;
  
}
