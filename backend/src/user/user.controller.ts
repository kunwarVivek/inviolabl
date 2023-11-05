import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./services/user.service";
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./create-user.dto";

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }
}