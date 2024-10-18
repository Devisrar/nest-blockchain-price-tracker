import { Test, TestingModule } from '@nestjs/testing';
import { SwapService } from './swap.service';
import axios from 'axios';

jest.mock('axios');  

describe('SwapService', () => {
  let service: SwapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwapService],
    }).compile();

    service = module.get<SwapService>(SwapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEthToBtcSwapRate', () => {
    it('should return BTC amount and fees for ETH to BTC swap', async () => {
      const axiosResponse = {
        data: {
          ethereum: { usd: 2000 },
          bitcoin: { usd: 40000 },
        },
      };
      (axios.get as jest.Mock).mockResolvedValueOnce(axiosResponse);

      const result = await service.getEthToBtcSwapRate(1);
      expect(result).toEqual({
        btcAmount: 0.05,
        feeInEth: 0.03,
        feeInUsd: 60,
      });
    });

    it('should handle errors when fetching swap rate', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      await expect(service.getEthToBtcSwapRate(1)).rejects.toThrow('Error fetching swap rate');
    });
  });
});
