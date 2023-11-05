import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';  // Assuming you have a user.entity.ts file for User entity
import { HashService } from '../hash.service';
import { CreateUserDto } from '../create-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async getUserByEmail(email): Promise<User> {
    console.log(email,"po")
    return await this.userRepository.findOne({ where:{email} });
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    // Validate DTO (Consider using class-validator if not already)

    const userExists = await this.getUserByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const user = this.userRepository.create(createUserDto);
    user.password = await this.hashService.hashPassword(user.password);

    return await this.userRepository.save(user);
  }
}
