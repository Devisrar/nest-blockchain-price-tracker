import { Test, TestingModule } from '@nestjs/testing';
import { PriceService } from './price.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { PriceEntity } from './entity/price.entity';

jest.mock('axios');  

describe('PriceService', () => {
  let service: PriceService;
  let priceRepository: Repository<PriceEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceService,
        {
          provide: getRepositoryToken(PriceEntity),  
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PriceService>(PriceService);
    priceRepository = module.get<Repository<PriceEntity>>(getRepositoryToken(PriceEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAndSavePrice', () => {
    it('should fetch price and save it in the repository', async () => {
      const axiosResponse = { data: { price: 2000 } };
      (axios.get as jest.Mock).mockResolvedValueOnce(axiosResponse);
      const saveSpy = jest.spyOn(priceRepository, 'save').mockResolvedValueOnce(undefined);
      await service.fetchAndSavePrice('ethereum');
      expect(saveSpy).toHaveBeenCalledWith({
        chain: 'ethereum',
        price: 2000,
        timestamp: expect.any(Date),
      });
    });

    it('should handle errors when fetching price', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      const saveSpy = jest.spyOn(priceRepository, 'save');
      await expect(service.fetchAndSavePrice('ethereum')).resolves.toBeUndefined();
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('getLastHourPrice', () => {
    it('should return the last price from the last hour', async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const findOneSpy = jest.spyOn(priceRepository, 'findOne').mockResolvedValueOnce({
        chain: 'ethereum',
        price: 1900,
        timestamp: oneHourAgo,
      } as PriceEntity);

      const result = await service.getLastHourPrice('ethereum');
      expect(findOneSpy).toHaveBeenCalled();
      expect(result).toEqual({
        chain: 'ethereum',
        price: 1900,
        timestamp: oneHourAgo,
      });
    });
  });
});
