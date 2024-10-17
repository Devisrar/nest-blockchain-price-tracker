import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from './email.service';
import { SetAlertDto } from './dto/set-alert.dto';
import { AlertEntity } from './entity/alert.entity';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectRepository(AlertEntity)
    private alertRepository: Repository<AlertEntity>,
    private emailService: EmailService,
  ) {}

  async createAlert(setAlertDto: SetAlertDto): Promise<void> {
    await this.alertRepository.save(setAlertDto);
    this.logger.log(`Alert created for ${setAlertDto.chain} at price ${setAlertDto.price}`);
  }

  async checkAndSendPriceAlerts(chain: 'ethereum' | 'polygon', price: number): Promise<void> {
    const alerts = await this.alertRepository.find({ where: { chain, price } });

    for (const alert of alerts) {
      try {
        await this.emailService.sendEmail(alert.email, `Price Alert for ${chain}`, `Price of ${chain} is now ${price}`);
        this.logger.log(`Sent alert to ${alert.email} for ${chain} at price ${price}`);
      } catch (error) {
        this.logger.error('Failed to send email', error.stack);
      }
    }
  }
}
