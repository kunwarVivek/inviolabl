import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('connect-wallet')
  async connectWallet(@Body() body: { address: string, signature: string, message: string }) {
    try {
      const { address, signature, message } = body;
      // Use the AuthService to verify the signature
      const isValidSignature = await this.authService.verifySignature(address, signature, message);
        console.log("isValidSignature",isValidSignature);
        
      if (isValidSignature) {
        // If the signature is valid, proceed with user authentication
        // For example, you might create a JWT token for the user session
        console.log("hi");
        
        const token = await this.authService.login(address);
        console.log("bye",token);
        
      return { success: true, token };
      } else {
        // If the signature is invalid, throw an exception
        throw new HttpException('Invalid signatures', HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      throw new HttpException('Invalid requests', HttpStatus.FORBIDDEN);
    }
  }
}
