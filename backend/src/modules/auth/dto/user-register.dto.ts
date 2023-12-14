import { RoleType } from '../../../constants';
import {
  EmailField,
  EnumFieldOptional,
  PasswordField,
  StringField,
} from '../../../decorators';

export class UserRegisterDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly tenantId!: string;

  @StringField()
  readonly lastName!: string;

  @EnumFieldOptional(() => RoleType, {
    default: RoleType.USER,
  })
  readonly role: RoleType = RoleType.USER;

  @EmailField()
  readonly email!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;
}
