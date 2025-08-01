import { Injectable } from '@nestjs/common';
import { ProviderService } from '../provider/provider.service';
import { RedisService } from 'src/modules/redis/services/redis.service';
import { PactManData } from '../interfaces/provider.interface';

@Injectable()
export class ComplianceService {
  constructor(
    private readonly providerService: ProviderService,
    private readonly redisService: RedisService,
  ) {}

  async checkCompliance(ein: string): Promise<PactManData> {


    const cached = await this.redisService.getQuery(ein);
    if (cached){
      await this.redisService.storeSearchHistory(cached);
      return cached;
    }
       

    const result = await this.providerService.getComplianceByEIN(ein);
    result.isCompliant = this.isFullyCompliant(result);

    await Promise.all([
      await this.redisService.storeQuery(ein, result),
      await this.redisService.storeSearchHistory(result),
    ]);
    

    return result;
  }

  async getSearchHistory(): Promise<PactManData[]> {
    const history = await this.redisService.getSearchHistory();
    return history;
  } 

  private isFullyCompliant(org: PactManData): boolean {
  return (
    org.bmf_status === true &&
    org.exempt_status_code === "01" &&
    org.revocation_code === null &&
    org.revocation_date === null &&
    org.ofac_status.includes("NOT included in the Office of Foreign Assets Control") &&
    org.pub78_verified === true
  );
}
}
