import { UserService } from "./services/user.service";
import { CreateUserDto } from "./create-user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    registerUser(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
}
