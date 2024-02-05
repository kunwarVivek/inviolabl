import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Post('connect-wallet')
  async connectWallet(
    @Body() body: { email: string; address: string; signature: string; message: string },
  ) {
    try {
      const { email, address, signature, message } = body;
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

        const wallet = await this.walletService.addWallet(address, email);


        return { success: true, token, wallet };
      }

      // If the signature is invalid, throw an exception
      throw new HttpException('Invalid signatures', HttpStatus.FORBIDDEN);
    } catch {
      throw new HttpException('Invalid requests', HttpStatus.FORBIDDEN);
    }
  }

  @Get('all-wallets')
  async getAllWallets() {
    try {
      const wallets = await this.walletService.getAllWallets();
      return { success: true, wallets };
    } catch (error) {
      throw new HttpException('Error fetching wallets', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('wallet-by-email/:email')
  async getSpecificWalletByEmail(@Param('email') email: string) {
    try {
      const wallets = await this.walletService.getWalletsByEmail(email);
      return { success: true, wallets };
    } catch (error) {
      throw new HttpException('Error fetching wallet by email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('add-wallet')
  async addWallet(
    @Body() body: { email: string; address: string; cid: string },
  ) {
    try {
      const { email, address } = body;
      const wallet = await this.walletService.addWallet(address, email);

      return { success: true, wallet };
    } catch (error) {
      throw new HttpException('Error adding wallet', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
