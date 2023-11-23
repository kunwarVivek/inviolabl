import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  // @Matches(/^[a-zA-Z0-9\-]+$/, { message: 'Domain must be unique and contain only alphanumeric characters and hyphens.' })
  domain!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Email must be unique and in a valid format.' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;
}
