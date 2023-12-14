import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { WalletController } from './wallet.controller'; // Make sure to import the controller
import { WalletService } from './wallet.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret', // You should store this in an environment variable
      signOptions: { expiresIn: '60m' }, // Tokens expire in 60 minutes
    }),
  ],
  controllers: [WalletController], // Add the controller here
  providers: [WalletService],
})
export class WalletModule {}
