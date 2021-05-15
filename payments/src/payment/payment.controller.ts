import { Controller, Body, Get, Post, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBody, ApiCreatedResponse, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';


@Controller('payment')
@ApiTags('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({
    operationId: 'createPayment',
    summary: 'Cancel payment',
    description: 'Create payment of order after confirmed',
  })
  @ApiBody({ type: CreatePaymentDto })
  @ApiCreatedResponse({
    type: CreatePaymentDto,
    description: 'Create payment'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.add(dto);
  }

  @Get()
  @ApiOperation({
    operationId: 'getPayments',
    summary: 'Get payments',
    description: 'Get list payments',
  })
  findAll() {
    return this.paymentService.findAll();
  }
}
