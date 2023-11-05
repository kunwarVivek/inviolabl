import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/user/hash.service';
import { UserService } from 'src/user/services/user.service';
export declare class AuthService {
    private userService;
    private hashService;
    private jwtService;
    constructor(userService: UserService, hashService: HashService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        email: any;
        username: any;
    }>;
}
