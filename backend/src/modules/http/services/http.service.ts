import { HttpService as NestHttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
    private readonly logger = new Logger(HttpService.name);
    
  constructor(
    private readonly nestHttpService: NestHttpService,
  ) { }

  async fetch<T>(url: string, config?: AxiosRequestConfig, returnError: boolean = false): Promise<T> {
    try {
      const response = await firstValueFrom(this.nestHttpService.get<T>(url, config));
      return { status: response.status, data: response.data } as T;
    } catch (error) {
      this.logger.error('Get request failed', error.response.data);
      if (error.code === 'ENOTFOUND') {
        throw 'Unable to connect to the host. Please check your internet connection';
      } else if(error.response?.data && error.response?.data.code == 404){
        throw new NotFoundException("EIN Not Found");
      } else {
        const errorMessage = error.response?.data.error || error.response?.statusText || error.message || error;
        if (returnError) {
          return errorMessage;
        } else {
          throw errorMessage;
        }
      }
    }
  }
}
