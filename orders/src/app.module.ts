import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    OrderModule,
  ],
})
export class AppModule {}
