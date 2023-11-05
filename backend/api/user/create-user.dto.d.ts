import { User } from '../user/entities/user.entity';
export declare class CreateUserDto extends User {
    email: string;
    password: string;
    username: string;
}
