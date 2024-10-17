import { Controller, Get, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { PriceService } from './price.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/auth.guard';

@ApiTags('Price')  
@Controller('price')
@UseGuards(ApiKeyGuard)  
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly prices within the last 24 hours' })  
  @ApiQuery({ name: 'chain', enum: ['ethereum', 'polygon'], required: true })  
  @ApiResponse({ status: 200, description: 'Successfully retrieved prices' }) 
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getHourlyPrices(@Query('chain') chain: 'ethereum' | 'polygon') {
    try {
      return await this.priceService.getPricesInLast24Hours(chain);
    } catch (error) {
      throw new HttpException('Failed to fetch prices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
