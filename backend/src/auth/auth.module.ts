import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller'; // Make sure to import the controller
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret', // You should store this in an environment variable
      signOptions: { expiresIn: '60m' }, // Tokens expire in 60 minutes
    }),
  ],
  controllers: [AuthController], // Add the controller here
  providers: [AuthService],
})
export class AuthModule {}
