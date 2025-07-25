import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisModule } from './redis/redis.module';
import { ComplianceModule } from './compliance/compliance.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    RedisModule, 
    ComplianceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
