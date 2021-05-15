import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';
import {Order} from './order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    exports: [
        OrderService,
    ],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
