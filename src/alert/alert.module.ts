import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertService } from './alert.service';
import { EmailService } from './email.service';
import { AlertController } from './alert.controller';
import { AlertEntity } from './entity/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertEntity])],
  providers: [AlertService, EmailService],
  controllers: [AlertController],
})
export class AlertModule {}
