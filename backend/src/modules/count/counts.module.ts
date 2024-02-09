import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Count } from './count.entity';
import { CountsController } from './counts.controller';
import { CountsService } from './counts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Count])],
  controllers: [CountsController],
  providers: [CountsService],
})
export class CountsModule {}
