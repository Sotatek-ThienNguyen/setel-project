import { Injectable, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Order, Status } from './order.entity';
import { OrderHistoryService } from './order-history.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TIME_TO_DELIVERY } from '../constants/order_constants';
import * as moment from 'moment';
@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly orderHistoryService: OrderHistoryService,
    ) {}

    @Cron(CronExpression.EVERY_SECOND)
    async handleCron() {
        const modifiedAt = moment().subtract(TIME_TO_DELIVERY, 'seconds').format('YYYY-MM-DD h:mm:ss')
        console.log('cronjob handle order modified at ', modifiedAt);
        this.orderRepository.update(
            { status: Status.CONFIRMED, updateTimestamp: modifiedAt },
            { status: Status.DELIVERED, updateTimestamp: moment().format('YYYY-MM-DD h:mm:ss') },
        )
    }

    async findAll(): Promise<Object> {
        var orders = await this.orderRepository.find();
        var lastModifiedOrder = await this.orderRepository.findOne({}, { order: { 'updateTimestamp': -1 } })

        return {
            list_orders: orders,
            last_modified: lastModifiedOrder.updateTimestamp
        };
    }

    async findOne(nmbr: string): Promise<Order> {
        const orderDetail = await this.orderRepository.findOne({ nmbr });
        if (!orderDetail) {
            throw new NotFoundException('Order not found');
        }

        return orderDetail;
    }

    async getDetailOrder(id: number): Promise<Order> {
        return await this.orderRepository.findOne({ id });
    }

    async hasNewUpdate(lastModified: any): Promise<Object> {
        let hasNewUpdate = await this.orderRepository.createQueryBuilder()
            .where('updateTimestamp > :lastModified', { lastModified: lastModified})
            .getOne()
        return hasNewUpdate
    }

    async fetchListOrder(params: any): Promise<Object> {
        let hasNewUpdate = await this.hasNewUpdate(params.last_modified)
        if (!hasNewUpdate) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            hasNewUpdate = await this.hasNewUpdate(params.last_modified)
        }
        return {
            success: hasNewUpdate
        }
    }

    async cancel(nmbr: string): Promise<Object> {
        const order = await this.orderRepository.findOne({ nmbr });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        if (![Status.CONFIRMED, Status.CREATED].includes(order.status)) {
            throw new NotFoundException('Order only cancel with created and confirmed status');
        }

        this.orderHistoryService.add(nmbr, Status.CANCELLED);
        const cancelSuccess = this.orderRepository.update(
            { nmbr },
            { status: Status.CANCELLED, updateTimestamp: new Date() },
        );
        if (!cancelSuccess) {
            throw new HttpException(
                {
                    message: 'Something went wrong. Try again later!'
                },
                HttpStatus.BAD_REQUEST
            )
        }

        return {
            success: true
        };
    }

    async confirm(nmbr: string): Promise<UpdateResult> {
        const order = await this.orderRepository.findOne({ nmbr });
        if (order.status !== 'created') {
            throw new NotFoundException('Order only confirmed after created');
        }
        this.orderHistoryService.add(nmbr, Status.CONFIRMED);
        return this.orderRepository.update(
            { nmbr },
            { status: Status.CONFIRMED, updateTimestamp: new Date() },
        );
    }

    add(dto: CreateOrderDto): Order {
        const order = new Order();
        order.name = dto.name;
        order.address = dto.address;
        order.price = dto.price;
        order.nmbr = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
        this.orderRepository.insert(order);
        this.orderHistoryService.add(order.nmbr, Status.CREATED);
        return order;
    }

    doPayment(order: Order) {
        const self = this;
        const http = require('http');
        const data = JSON.stringify({
            name: order.name,
            address: order.address,
            price: order.price,
            orderNumber: order.nmbr,
        });

        const options = {
            hostname: 'payments.local',
            port: 3001,
            path: '/payment',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };
        const req = http.request(options, (res) => {
            let responseString = '';

            res.on('data', (responseData) => {
                responseString += responseData;
            });
            res.on('end', () => {
                const responseJson = JSON.parse(responseString);
                if (responseJson.status === 'confirmed') {
                    self.confirm(responseJson.orderNumber);
                } else {
                    self.cancel(responseJson.orderNumber);
                }
            });
        });

        req.write(data);
        req.end();
    }
}
