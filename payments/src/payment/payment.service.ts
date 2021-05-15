import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Payment, Status } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) {}

    async findAll(): Promise<Payment[]> {
        return await this.paymentRepository.find();
    }

    async add(dto: CreatePaymentDto): Promise<Payment> {
        let existed = await this.paymentRepository.findOne({ orderNumber: dto.orderNumber });
        if (existed) {
            throw new BadRequestException('Existed order with same order number')
        } else {
            const payment = new Payment();
            payment.name = dto.name;
            payment.address = dto.address;
            payment.price = dto.price;
            payment.orderNumber = dto.orderNumber;
            payment.createdBy = dto.createdBy;
            payment.status = Math.random() >= 0.5 ? Status.CONFIRMED : Status.CANCELLED;
            this.paymentRepository.insert(payment);
            return payment;
        }
    }
}
