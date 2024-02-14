
import { Controller, Post, Body, Put } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Post()
  async proxyRequest(@Body() requestBody: any) {
    const { url, data, config } = requestBody;
    return this.proxyService.post(url, data, config);
  }

  @Put()
  async updateProxy(@Body() requestBody: any) {
    const { url, data, config } = requestBody;
    return this.proxyService.updateProxy(url, data, config);
  }

}
