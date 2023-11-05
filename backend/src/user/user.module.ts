// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { HashService } from './hash.service';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategy/local.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService,HashService, AuthService, JwtStrategy, LocalStrategy,JwtService],
  controllers:[UserController],
  exports: [UserService],
})
export class UserModule {}
