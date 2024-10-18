import { Test, TestingModule } from '@nestjs/testing';
import { AlertService } from './alert.service';
import { EmailService } from './email.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertEntity } from './entity/alert.entity';

describe('AlertService', () => {
  let service: AlertService;
  let alertRepository: Repository<AlertEntity>;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertService,
        {
          provide: getRepositoryToken(AlertEntity),
          useClass: Repository,  
        },
        {
          provide: EmailService,
          useValue: { sendEmail: jest.fn() },  
        },
      ],
    }).compile();

    service = module.get<AlertService>(AlertService);
    alertRepository = module.get<Repository<AlertEntity>>(getRepositoryToken(AlertEntity));
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAndSendPriceAlerts', () => {
    it('should send emails if price matches alert threshold', async () => {
      const alerts = [
        { chain: 'ethereum', price: 2000, email: 'test@example.com' },
      ] as AlertEntity[];

      jest.spyOn(alertRepository, 'find').mockResolvedValueOnce(alerts);
      await service.checkAndSendPriceAlerts('ethereum', 2000);
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Price Alert for ethereum',
        'Price of ethereum is now 2000',
      );
    });

    it('should not send emails if no alerts match', async () => {
      jest.spyOn(alertRepository, 'find').mockResolvedValueOnce([]);
      await service.checkAndSendPriceAlerts('ethereum', 2000);
      expect(emailService.sendEmail).not.toHaveBeenCalled();
    });
  });
});
