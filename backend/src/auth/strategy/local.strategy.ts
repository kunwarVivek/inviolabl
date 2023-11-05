import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import {
    Strategy
  } from 'passport-local';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string,d:string): Promise < any > {
    const user = await this.authService.validateUser(email, password);
    console.log("sljbndkAS",user)
    
    if (!user) {
      throw new UnauthorizedException({
        message: "You have entered a wrong username or password"
      });
    }
    return user;
  }
}