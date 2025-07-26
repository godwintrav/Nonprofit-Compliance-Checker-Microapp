import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  @HttpCode(200)
  getHealthStatus(): string {
    return 'App is healthy';
  }
}
