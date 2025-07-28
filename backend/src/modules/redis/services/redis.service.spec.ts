import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PactManData } from 'src/modules/compliance/interfaces/provider.interface';

// Mock Redis class
const mockRedis = {
  set: jest.fn(),
  get: jest.fn(),
  rpush: jest.fn(),
  lrange: jest.fn(),
  flushall: jest.fn(),
};

jest.mock('ioredis', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockRedis),
  };
});

describe('RedisService', () => {
  let service: RedisService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values = {
                REDIS_HOST: 'localhost',
                REDIS_PORT: 6379,
              };
              return values[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should initialize Redis client with config', () => {
      service.onModuleInit();

      expect(configService.get).toHaveBeenCalledWith('REDIS_HOST');
      expect(configService.get).toHaveBeenCalledWith('REDIS_PORT');
    });
  });

  describe('storeQuery', () => {
    it('should store query result with expiration', async () => {
      service.onModuleInit();
      await service.storeQuery('123456789', { name: 'Test Org' });

      expect(mockRedis.set).toHaveBeenCalledWith(
        'history:123456789',
        JSON.stringify({ name: 'Test Org' }),
        'EX',
        300,
      );
    });
  });

  describe('getQuery', () => {
    it('should return parsed data if found in Redis', async () => {
      const mockData: PactManData = { name: 'Sample Org' } as any;
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(mockData));

      service.onModuleInit();
      const result = await service.getQuery('123456789');

      expect(mockRedis.get).toHaveBeenCalledWith('history:123456789');
      expect(result).toEqual(mockData);
    });

    it('should return null if data is not found', async () => {
      mockRedis.get.mockResolvedValueOnce(null);

      service.onModuleInit();
      const result = await service.getQuery('not-found');

      expect(result).toBeNull();
    });
  });

  describe('storeSearchHistory', () => {
    it('should add EIN to search history list', async () => {
      const mockData: PactManData = { name: 'Sample Org' } as any;
      service.onModuleInit();
      await service.storeSearchHistory(mockData);

      expect(mockRedis.rpush).toHaveBeenCalledWith('search:history', JSON.stringify(mockData));
    });
  });

  describe('getSearchHistory', () => {
    it('should return parsed search history list', async () => {
      const mockData1: PactManData = { name: 'Sample Org 1' } as any;
      const mockData2: PactManData = { name: 'Sample Org 2' } as any;
      const mockData3: PactManData = { name: 'Sample Org 3' } as any;
      mockRedis.lrange.mockResolvedValueOnce([
        JSON.stringify(mockData1),
        JSON.stringify(mockData2),
        JSON.stringify(mockData3),
      ]);

      service.onModuleInit();
      const result = await service.getSearchHistory();

      expect(mockRedis.lrange).toHaveBeenCalledWith('search:history', 0, -1);
      expect(result).toEqual([mockData1, mockData2, mockData3]);
    });
  });

  describe('flushAll', () => {
    it('should flush all Redis keys', async () => {
      mockRedis.flushall.mockResolvedValueOnce('OK');

      service.onModuleInit();
      const result = await service.flushAll();

      expect(mockRedis.flushall).toHaveBeenCalled();
      expect(result).toEqual('OK');
    });
  });
});
