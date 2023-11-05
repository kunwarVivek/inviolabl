// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { User } from 'src/user/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { HashService } from 'src/user/hash.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:"secret",
      signOptions: {
        expiresIn: 3600,  // 1 hour
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers:[AuthController],

  providers: [AuthService,UserService, LocalStrategy, HashService],
  exports: [PassportModule],
})
export class AuthModule {}
