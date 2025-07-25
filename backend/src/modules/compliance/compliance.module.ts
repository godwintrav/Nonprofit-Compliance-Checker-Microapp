import { Module } from '@nestjs/common';
import { ComplianceService } from './services/compliance.service';
import { ComplianceController } from './controllers/compliance.controller';
import { RedisModule } from '../redis/redis.module';
import { HttpModule } from '../http/http.module';
import { ProviderService } from './provider/provider.service';

@Module({
  controllers: [ComplianceController],
  providers: [ComplianceService, ProviderService],
  imports: [RedisModule, HttpModule]
})
export class ComplianceModule {}
