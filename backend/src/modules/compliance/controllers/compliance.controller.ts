import { Controller, Get, HttpCode, Param, } from '@nestjs/common';
import { ComplianceService } from '../services/compliance.service';
import { GetOrganizationByEinDto } from '../dto/compliance.dto';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('/verify/:ein')
  @HttpCode(200)
  checkCompliance(@Param() param: GetOrganizationByEinDto) {
    return this.complianceService.checkCompliance(param.ein);
  }

  @Get('history')
  @HttpCode(200)
  getSearchHistory() {
    return this.complianceService.getSearchHistory();
  }

}
