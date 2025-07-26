import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceService } from './compliance.service';
import { ProviderService } from '../provider/provider.service';
import { RedisService } from 'src/modules/redis/services/redis.service';
import { PactManData } from '../interfaces/provider.interface';
import { NotFoundException } from '@nestjs/common';

describe('ComplianceService', () => {
  let complianceService: ComplianceService;
  let providerService: jest.Mocked<ProviderService>;
  let redisService: jest.Mocked<RedisService>;

  const mockPactManData: PactManData = {
    ein: '123456789',
    name: 'Test Nonprofit Org',
    complianceStatus: 'compliant',
  } as unknown as Partial<PactManData> as PactManData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplianceService,
        {
          provide: ProviderService,
          useValue: {
            getComplianceByEIN: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            storeSearchHistory: jest.fn(),
            getQuery: jest.fn(),
            storeQuery: jest.fn(),
            getSearchHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    complianceService = module.get<ComplianceService>(ComplianceService);
    providerService = module.get(ProviderService);
    redisService = module.get(RedisService);
  });

  describe('checkCompliance', () => {
    it('should return cached data if available', async () => {
      redisService.getQuery.mockResolvedValue(mockPactManData);

      const result = await complianceService.checkCompliance('123456789');

      expect(redisService.storeSearchHistory).toHaveBeenCalledWith('123456789');
      expect(redisService.getQuery).toHaveBeenCalledWith('123456789');
      expect(result).toEqual(mockPactManData);
      expect(providerService.getComplianceByEIN).not.toHaveBeenCalled();
    });

    it('should fetch from provider if cache is empty, then cache the result', async () => {
      redisService.getQuery.mockResolvedValue(null);
      providerService.getComplianceByEIN.mockResolvedValue(mockPactManData);

      const result = await complianceService.checkCompliance('123456789');

      expect(redisService.storeSearchHistory).toHaveBeenCalledWith('123456789');
      expect(redisService.getQuery).toHaveBeenCalledWith('123456789');
      expect(providerService.getComplianceByEIN).toHaveBeenCalledWith('123456789');
      expect(redisService.storeQuery).toHaveBeenCalledWith('123456789', mockPactManData);
      expect(result).toEqual(mockPactManData);
    });

    it('should throw error from provider if EIN not found', async () => {
      redisService.getQuery.mockResolvedValue(null);
      const error = new NotFoundException('The EIN provided does not exist');
      providerService.getComplianceByEIN.mockRejectedValue(error);

      await expect(complianceService.checkCompliance('000000000')).rejects.toThrow(NotFoundException);

      expect(redisService.storeSearchHistory).toHaveBeenCalledWith('000000000');
      expect(providerService.getComplianceByEIN).toHaveBeenCalledWith('000000000');
    });
  });

  describe('getSearchHistory', () => {
    it('should return search history from Redis', async () => {
      const mockHistory = ['123456789', '987654321'];
      redisService.getSearchHistory.mockResolvedValue(mockHistory);

      const result = await complianceService.getSearchHistory();

      expect(result).toEqual(mockHistory);
      expect(redisService.getSearchHistory).toHaveBeenCalled();
    });
  });
});
