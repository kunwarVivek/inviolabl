import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller'; // Make sure to import the controller
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
          secret: "secret", // You should store this in an environment variable
          signOptions: { expiresIn: '60m' }, // Tokens expire in 60 minutes
        }),],
  controllers: [WalletController], // Add the controller here
  providers: [WalletService],
})
export class WalletModule {}
