import { Test, TestingModule } from '@nestjs/testing';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from './http.service';

describe('HttpService', () => {
  let service: HttpService;
  let axiosHttpService: jest.Mocked<NestHttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpService,
        {
          provide: NestHttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HttpService>(HttpService);
    axiosHttpService = module.get(NestHttpService);
  });

  const url = 'https://test.com/api';
  const mockConfig = { headers: { Authorization: 'Bearer token' } };

  it('should return data and status on success', async () => {
    const mockResponse: AxiosResponse = {
      status: 200,
      data: { test: 'success' },
      statusText: 'OK',
      headers: {},
      config: {},
    } as unknown as Partial<AxiosResponse> as AxiosResponse;

    axiosHttpService.get.mockReturnValueOnce(of(mockResponse));

    const result = await service.fetch<typeof mockResponse.data>(url, mockConfig);

    expect(result).toEqual({ status: 200, data: { test: 'success' } });
    expect(axiosHttpService.get).toHaveBeenCalledWith(url, mockConfig);
  });

  it('should throw a string for ENOTFOUND error', async () => {
    const error = {
      code: 'ENOTFOUND',
      response: { data: {} },
    };

    axiosHttpService.get.mockReturnValueOnce(throwError(() => error));

    await expect(service.fetch(url)).rejects.toEqual(
      'Unable to connect to the host. Please check your internet connection',
    );
  });

  it('should throw NotFoundException for 404 error in response data', async () => {
    const error = {
      response: {
        data: {
          code: 404,
        },
      },
    };

    axiosHttpService.get.mockReturnValueOnce(throwError(() => error));

    await expect(service.fetch(url)).rejects.toThrow(NotFoundException);
  });

  it('should throw extracted error message for generic errors when returnError is false', async () => {
    const error = {
      response: {
        data: {
          error: 'Some internal error',
        },
        statusText: 'Internal Server Error',
      },
      message: 'Something broke',
    };

    axiosHttpService.get.mockReturnValueOnce(throwError(() => error));

    await expect(service.fetch(url)).rejects.toEqual('Some internal error');
  });

  it('should return error message when returnError is true', async () => {
    const error = {
      response: {
        data: {
          error: 'Some internal error',
        },
        statusText: 'Internal Server Error',
      },
      message: 'Something broke',
    };

    axiosHttpService.get.mockReturnValueOnce(throwError(() => error));

    const result = await service.fetch(url, undefined, true);
    expect(result).toEqual('Some internal error');
  });
});
