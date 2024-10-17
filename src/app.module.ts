import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PriceModule } from './price/price.module';
import { AlertModule } from './alert/alert.module';
import { SwapModule } from './swap/swap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    ScheduleModule.forRoot(),                  
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    PriceModule,
    AlertModule,
    SwapModule,
  ],
})
export class AppModule {}
