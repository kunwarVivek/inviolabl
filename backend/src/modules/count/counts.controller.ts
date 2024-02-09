import { Controller, Get, Param, Post } from '@nestjs/common';
import { CountsService } from './counts.service';
import { Count } from './count.entity';

@Controller('counts')
export class CountsController {
  constructor(private readonly countsService: CountsService) {}

  @Get()
  async getAllCounts(): Promise<Count[]> {
    return this.countsService.getAllCounts();
  }

  @Get(':cid/views')
  getNumberOfViews(@Param('cid') cid: string): Promise<number> {
    return this.countsService.getNumberOfViews(cid);
  }

  @Get(':cid/downloads')
  getNumberOfDownloads(@Param('cid') cid: string): Promise<number> {
    return this.countsService.getNumberOfDownloads(cid);
  }

  @Post(':cid/views/increment')
  async incrementViews(@Param('cid') cid: string): Promise<void> {
    await this.countsService.incrementViews(cid);
  }

  @Post(':cid/downloads/increment')
  async incrementDownloads(@Param('cid') cid: string): Promise<void> {
    await this.countsService.incrementDownloads(cid);
  }

  @Post(':cid')
  async createCount(@Param('cid') cid: string): Promise<void> {
    const existingCount = await this.countsService.getByCID(cid);
    if (!existingCount) {
      await this.countsService.createCountWithInitialCounts(cid);
    }
  }
}
