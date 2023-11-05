import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { HashService } from '../hash.service';
import { CreateUserDto } from '../create-user.dto';
export declare class UserService {
    private userRepository;
    private hashService;
    constructor(userRepository: Repository<User>, hashService: HashService);
    getUserByEmail(email: any): Promise<User>;
    registerUser(createUserDto: CreateUserDto): Promise<User>;
}
