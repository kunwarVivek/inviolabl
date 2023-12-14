import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('connect-wallet')
  async connectWallet(
    @Body() body: { address: string; signature: string; message: string },
  ) {
    try {
      const { address, signature, message } = body;
      // Use the WalletService to verify the signature
      const isValidSignature = await this.walletService.verifySignature(
        address,
        signature,
        message,
      );
      console.log('isValidSignature', isValidSignature);

      if (isValidSignature) {
        // If the signature is valid, proceed with user authentication
        // For example, you might create a JWT token for the user session
        console.log('hi');

        const token = await this.walletService.login(address);
        console.log('bye', token);

        return { success: true, token };
      }

      // If the signature is invalid, throw an exception
      throw new HttpException('Invalid signatures', HttpStatus.FORBIDDEN);
    } catch {
      throw new HttpException('Invalid requests', HttpStatus.FORBIDDEN);
    }
  }
}
