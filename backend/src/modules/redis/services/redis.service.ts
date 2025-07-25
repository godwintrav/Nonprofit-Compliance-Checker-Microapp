import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {Redis} from 'ioredis';

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
      port: this.configService.get<number>('REDIS_HOST') ?? 6379,
    });
  }
  
  async storeQuery(ein: string, result: any): Promise<void> {
    await this.client.set(`history:${ein}`, JSON.stringify(result), 'EX', 900);
  }
  
  async getQuery(ein: string): Promise<any> {
    const data = await this.client.get(`history:${ein}`);
    return data ? JSON.parse(data) : null;
  }
  
  async storeSearchHistory(ein: string): Promise<void> {
    await this.client.rpush("search:history", JSON.stringify(ein));
  }
  
  async getSearchHistory() {
    const key = `search:history`;
    const results = await this.client.lrange(key, 0, -1);
    return results.map(item => JSON.parse(item));
  }
  
  async flushAll(): Promise<string> {
    return this.client.flushall();
  }
}
