import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  domain!: string;
}
