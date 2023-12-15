import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { WalletEntity } from './wallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) { }

  // This method assumes that you've asked the client to sign a message with their private key
  // and you've received the signature and the address from the client.
  async verifySignature(
    address: string,
    signature: string,
    originalMessage: string,
  ): Promise<boolean> {
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
    console.log(address, 'juadd');

    const payload = { address };
    console.log(payload, 'payload');

    try {
      const accessToken = this.jwtService.sign(payload);
      console.log('Token generated', accessToken);

      return {
        access_token: accessToken,
      };
    } catch (error) {
      console.error('Error signing the JWT:', error);

      throw new InternalServerErrorException('Error generating access token');
    }
  }

  async getAllWallets(): Promise<WalletEntity[]> {
    return this.walletRepository.find();
  }

  async addWallet(address: string, email: string): Promise<WalletEntity> {
    const wallet = this.walletRepository.create({ address, email });
    return this.walletRepository.save(wallet);
  }

  async getWalletsByEmail(email: string): Promise<WalletEntity[]> {
    try {
      
      const wallets = await this.walletRepository.find({ where: { email } });
      return wallets;
    } catch (error) {
      console.error('Error fetching wallets by email:', error);

      throw new InternalServerErrorException('Error fetching wallets by email');
    }
  }

}
