import { Module } from '@nestjs/common';
import { HttpService } from './services/http.service';
import { HttpModule as NestHttpModule } from '@nestjs/axios';

@Module({
  imports: [NestHttpModule],
  providers: [HttpService],
  exports: [HttpService]
})
export class HttpModule {}
