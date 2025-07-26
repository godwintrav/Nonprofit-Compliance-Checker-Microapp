import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from '../services/compliance.service';
import { GetOrganizationByEinDto } from '../dto/compliance.dto';

describe('ComplianceController', () => {
  let controller: ComplianceController;
  let service: ComplianceService;

  const mockComplianceService = {
    checkCompliance: jest.fn(),
    getSearchHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceController],
      providers: [
        {
          provide: ComplianceService,
          useValue: mockComplianceService,
        },
      ],
    }).compile();

    controller = module.get<ComplianceController>(ComplianceController);
    service = module.get<ComplianceService>(ComplianceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkCompliance', () => {
    it('should call ComplianceService.checkCompliance with EIN and return the result', async () => {
      const ein = '996589560';
      const dto: GetOrganizationByEinDto = { ein };
      const mockResult = { valid: true, ein };

      mockComplianceService.checkCompliance.mockResolvedValue(mockResult);

      const result = await controller.checkCompliance(dto);

      expect(mockComplianceService.checkCompliance).toHaveBeenCalledWith(ein);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getSearchHistory', () => {
    it('should return the search history from the service', async () => {
      const mockHistory = [
        { ein: '123456789', checkedAt: '2025-07-25T12:00:00Z' },
        { ein: '987654321', checkedAt: '2025-07-24T09:30:00Z' },
      ];

      mockComplianceService.getSearchHistory.mockResolvedValue(mockHistory);

      const result = await controller.getSearchHistory();

      expect(mockComplianceService.getSearchHistory).toHaveBeenCalled();
      expect(result).toEqual(mockHistory);
    });
  });
});
