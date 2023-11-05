// src/auth/auth.controller.ts

import { Controller, Post, Request,UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  AuthGuard
} from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post(`/login`)
  async login(@Request() req) {
    return this.authService.login(req.body);
  }
}
