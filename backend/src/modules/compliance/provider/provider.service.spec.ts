import { Test, TestingModule } from '@nestjs/testing';
import { ProviderService } from './provider.service';
import { HttpService } from 'src/modules/http/services/http.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, HttpException } from '@nestjs/common';
import { PactManData, PactManApiResponse } from '../interfaces/provider.interface';

describe('ProviderService', () => {
  let service: ProviderService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  const ein = '123456789';
  const baseUrl = 'https://entities.pactman.org/api/entities/nonprofitcheck/v1/us';

  const mockPactManData: PactManData = {
    ein: '123456789',
    name: 'Test Nonprofit',
    complianceStatus: 'compliant',
    // add more fields as needed
  } as unknown as Partial<PactManData> as PactManData;

  const successResponse = {
    status: 200,
    data: {
      code: 200,
      data: mockPactManData,
    },
  };

  const notFoundResponse = {
    status: 200,
    data: {
      code: 404,
      errors: [{ reason: 'EIN not found' }],
    },
  };

  const errorResponse = {
    status: 500,
    data: {
      code: 500,
      errors: [{ reason: 'Something went wrong' }],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderService,
        {
          provide: HttpService,
          useValue: {
            fetch: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake_api_key'),
          },
        },
      ],
    }).compile();

    service = module.get<ProviderService>(ProviderService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
  });

  describe('getComplianceByEIN', () => {
    it('should return PactManData when API responds with 200 and valid data', async () => {
      httpService.fetch.mockResolvedValue(successResponse as any);

      const result = await service.getComplianceByEIN(ein);

      expect(configService.get).toHaveBeenCalledWith('PACTMAN_API_KEY');
      expect(httpService.fetch).toHaveBeenCalledWith(
        `${baseUrl}/ein/${ein}`,
        { headers: { Authorization: 'Bearer fake_api_key' } }
      );
      expect(result).toEqual(mockPactManData);
    });

    it('should throw NotFoundException when API response has code 404', async () => {
      httpService.fetch.mockResolvedValue(notFoundResponse as any);

      await expect(service.getComplianceByEIN(ein)).rejects.toThrow(NotFoundException);
      expect(httpService.fetch).toHaveBeenCalled();
    });

    it('should throw HttpException when API response has other error codes', async () => {
      httpService.fetch.mockResolvedValue(errorResponse as any);

      await expect(service.getComplianceByEIN(ein)).rejects.toThrow(HttpException);
      expect(httpService.fetch).toHaveBeenCalled();
    });

    it('should log and rethrow unexpected errors from HttpService', async () => {
      const thrownError = new Error('Network error');
      httpService.fetch.mockRejectedValue(thrownError);

      await expect(service.getComplianceByEIN(ein)).rejects.toThrow('Network error');
    });
  });
});
