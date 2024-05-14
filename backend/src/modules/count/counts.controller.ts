import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { CountsService } from './counts.service';
import { Count } from './count.entity';
import { SentryInterceptor } from '../../interceptors/sentry-interceptor.service';

@UseInterceptors(SentryInterceptor)
@Controller('counts')
export class CountsController {
  constructor(private readonly countsService: CountsService) { }

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
  async createCount(
    @Param('cid') cid: string,
    @Body() body: { email: string, filename: string, filesize: number, filetype: string }
  ): Promise<void> {
    const { email, filename, filesize, filetype } = body;
    const existingCount = await this.countsService.getByCID(cid);
    if (!existingCount) {
      await this.countsService.createCountWithInitialCounts(cid, email, filename, filesize, filetype);
    }
  }

  @Post(':cid/shared-emails')
  async addSharedEmail(@Param('cid') cid: string, @Body('email') email: string): Promise<void> {
    await this.countsService.addSharedEmail(cid, email);
  }

  @Get('emails/:email')
  async getCountsByEmail(@Param('email') email: string): Promise<Count[] | undefined> {
    return this.countsService.getCountsByEmail(email);
  }

}
