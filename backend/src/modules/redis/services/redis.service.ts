import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PactManData } from 'src/modules/compliance/interfaces/provider.interface';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;
  constructor(
    private readonly configService: ConfigService
  ) {
    
  }
  
  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST') ?? 'localhost',
      port: this.configService.get<number>('REDIS_PORT') ?? 6379,
      password: this.configService.get<string>('REDIS_PASSWORD') ?? '',
    });
  }
  
  async storeQuery(ein: string, result: any): Promise<void> {
    await this.client.set(`history:${ein}`, JSON.stringify(result), 'EX', 300);
  }
  
  async getQuery(ein: string): Promise<PactManData | null> {
    const data = await this.client.get(`history:${ein}`);
    return data ? JSON.parse(data) : null;
  }
  
  async storeSearchHistory(data: PactManData): Promise<void> {
    await this.client.rpush("search:history", JSON.stringify(data));
  }
  
  async getSearchHistory(): Promise<PactManData[]> {
    const key = `search:history`;
    let results = await this.client.lrange(key, 0, -1);
    results = results.reverse()
    return results.map(item => JSON.parse(item) as PactManData);
  }
  
  async flushAll(): Promise<string> {
    return this.client.flushall();
  }
}
