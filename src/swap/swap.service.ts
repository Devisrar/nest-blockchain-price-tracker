import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import axios from 'axios';

@ApiTags('Swap')  
@Injectable()
export class SwapService {
  private readonly logger = new Logger(SwapService.name);

  @ApiOperation({ summary: 'Get ETH to BTC swap rate' })  
  @ApiResponse({ status: 200, description: 'Swap rate calculated successfully' })  
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getEthToBtcSwapRate(ethAmount: number) {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd');
      const ethPriceInUsd = response.data.ethereum.usd;
      const btcPriceInUsd = response.data.bitcoin.usd;

      const btcAmount = (ethAmount * ethPriceInUsd) / btcPriceInUsd;
      const feeInEth = ethAmount * 0.03;
      const feeInUsd = ethPriceInUsd * feeInEth;

      return {
        btcAmount,
        feeInEth,
        feeInUsd,
      };
    } catch (error) {
      this.logger.error('Failed to get swap rate', error.stack);
      throw new Error('Error fetching swap rate');
    }
  }
}
