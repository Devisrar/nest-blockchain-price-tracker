import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import axios from 'axios';
import { PriceEntity } from './entity/price.entity';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
  ) {}

  async fetchAndSavePrice(chain: 'ethereum' | 'polygon'): Promise<void> {
    try {
      const response = await axios.get(`https://api.moralis.io/.../${chain}`);
      const price = response.data.price;

      await this.priceRepository.save({
        chain,
        price,
        timestamp: new Date(),
      });

      this.logger.log(`Saved ${chain} price: ${price}`);
    } catch (error) {
      this.logger.error('Error fetching prices', error.stack);
    }
  }

  async getLastHourPrice(chain: 'ethereum' | 'polygon') {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.priceRepository.findOne({
      where: { chain, timestamp: MoreThan(oneHourAgo) },
      order: { timestamp: 'DESC' },
    });
  }

  async getPricesInLast24Hours(chain: 'ethereum' | 'polygon') {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.priceRepository.find({
      where: { chain, timestamp: MoreThan(oneDayAgo) },
      order: { timestamp: 'DESC' },
    });
  }
}
