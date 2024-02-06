import { Module } from '@nestjs/common';
import { PrivyService } from './privy.service';
import { PrivyController } from './privy.controller';


@Module({
  controllers: [PrivyController],
  providers: [PrivyService],
})
export class PrivyModule {}
