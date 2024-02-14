// proxy.service.ts

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  async post(url: string, data: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.httpService.axiosRef.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProxy(url: string, data: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.httpService.axiosRef.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

}
