import { Controller, Body, Param, Get, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    const order = this.orderService.add(dto);
    setTimeout(() => {
      this.orderService.doPayment(order);
    }, 3000);
    return order;
  }

  @Put('cancel/:number')
  cancel(@Param('number') nmbr) {
    return this.orderService.cancel(nmbr);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('status/:number')
  findOne(@Param('number') nmbr) {
    return this.orderService.findOne(nmbr);
  }

  // @Get('/:id')
  // getDetailOrder(@Param('id') orderId) {
  //   return this.orderService.getDetailOrder(orderId);
  // } 
  // why cannot put in here?

  @Get('/fetch-order')
  async fetchListOrder(@Query() params: any) {
    return await this.orderService.fetchListOrder(params);
  }

  @Get('/:id')
  getDetailOrder(@Param('id') orderId) {
    return this.orderService.getDetailOrder(orderId);
  }
}
