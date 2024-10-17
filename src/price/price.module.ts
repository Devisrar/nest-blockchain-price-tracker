import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';  
import { PriceEntity } from './entity/price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriceEntity])],
  providers: [PriceService],
  controllers: [PriceController],  
  exports: [PriceService],
})
export class PriceModule {}
