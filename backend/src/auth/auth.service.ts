import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}
  // This method assumes that you've asked the client to sign a message with their private key
  // and you've received the signature and the address from the client.
  async verifySignature(address: string, signature: string, originalMessage: string): Promise<boolean> {
    try {
        console.log(signature);
        
      // Ethers.js provides a utility function to recover the address from a signature
      const recoveredAddress = ethers.verifyMessage(originalMessage, signature);
      // Check if the recovered address matches the provided address
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      // If there's an error (e.g., invalid signature), we return false
      console.error('Error verifying signature', error);
      return false;
    }
  }
  async login(address: string) {
    console.log(address,"juadd");
    
    const payload = { address };
    console.log(payload,"payload");
    
    try {
      const accessToken = this.jwtService.sign(payload);
      console.log("Token generated", accessToken);
      return {
          access_token: accessToken,
      };
  } catch (error) {
      console.error("Error signing the JWT:", error);
      throw new InternalServerErrorException('Error generating access token');
  }
}
}
