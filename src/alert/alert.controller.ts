import { Body, Controller, Post, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AlertService } from './alert.service';
import { SetAlertDto } from './dto/set-alert.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Alert')  
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('set')
  @ApiOperation({ summary: 'Set a price alert' })  
  @ApiResponse({ status: 201, description: 'Alert created successfully' })  
  @ApiResponse({ status: 400, description: 'Invalid input data' })  
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ transform: true }))  
  async setPriceAlert(@Body() setAlertDto: SetAlertDto) {
    try {
      await this.alertService.createAlert(setAlertDto);
      return { message: 'Alert created successfully' };
    } catch (error) {
      throw new HttpException('Failed to create alert', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
