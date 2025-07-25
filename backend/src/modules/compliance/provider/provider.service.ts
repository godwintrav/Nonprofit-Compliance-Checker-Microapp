import { Injectable, HttpException, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpService } from 'src/modules/http/services/http.service';
import { PactManApiResponse, PactManData } from '../interfaces/provider.interface';

@Injectable()
export class ProviderService {
  private readonly logger = new Logger(ProviderService.name);
  private readonly BASE_URL = 'https://entities.pactman.org/api/entities/nonprofitcheck/v1/us';

  constructor(private readonly httpService: HttpService, private readonly configServie: ConfigService) {}

  async getComplianceByEIN(ein: string): Promise<PactManData> {
    const url = `${this.BASE_URL}/ein/${ein}`;
    const headers = {
        'Authorization': `Bearer ${this.configServie.get<string>('PACTMAN_API_KEY')}`
    }

    try {
      const response = await this.httpService.fetch<{status: number, data: PactManApiResponse}>(url, {headers});

      if(response.data.code == 404){
        throw new NotFoundException(response.data.errors![0].reason);
      }

      if(response.status == 200){
        return response.data.data!;
      }
      
      throw new HttpException(`Failed to fetch compliance info: ${response.data.errors![0].reason}`, 500);
    } catch (error) {
      this.logger.error(`Error fetching compliance for EIN ${ein}`, error);
      throw error;
    }
  }

}
