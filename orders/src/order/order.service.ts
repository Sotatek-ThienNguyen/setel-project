import { Injectable, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Order, Status } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TIME_TO_DELIVERY, ADMIN } from '../constants/order_constants';
import * as _ from 'lodash';
import * as moment from 'moment';
@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
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

    async findAll(userId: number): Promise<Object> {
        var orders = await this.orderRepository.find({ createdBy: userId });
        var lastModifiedOrder = await this.orderRepository.findOne({},{ where: { 'createdBy': userId }, order: { 'updateTimestamp': -1 } })

        return {
            list_orders: orders,
            last_modified: lastModifiedOrder.updateTimestamp
        };
    }

    async findOne(id: number): Promise<Order> {
        const orderDetail = await this.orderRepository.findOne({ id });
        if (!orderDetail) {
            throw new NotFoundException('Order not found');
        }

        return orderDetail;
    }

    async hasNewData(lastModified: any): Promise<Object> {
        let hasNewData = await this.orderRepository.createQueryBuilder()
            .where('updateTimestamp > :lastModified', { lastModified: lastModified})
            .getOne()
        return !_.isEmpty(hasNewData)
    }

    async fetchListOrder(params: any): Promise<Object> {
        let hasNewData = await this.hasNewData(params.last_modified)
        if (!hasNewData) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            hasNewData = await this.hasNewData(params.last_modified)
        }
        return {
            has_new_data: hasNewData
        }
    }

    async cancel(nmbr: string): Promise<Object> {
        const order = await this.orderRepository.findOne({ nmbr });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        if (order.status !== Status.CONFIRMED && order.status !== Status.CREATED) {
            throw new NotFoundException('Order only cancel with created and confirmed status');
        }

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
            success: true,
            message: 'Cancel order successfull.'
        };
    }

    async confirm(nmbr: string): Promise<UpdateResult> {
        const order = await this.orderRepository.findOne({ nmbr });
        if (order.status !== 'created') {
            throw new NotFoundException('Order only confirmed after created');
        }
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
        order.createdBy = ADMIN;
        order.nmbr = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
        this.orderRepository.insert(order);
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
            createdBy: ADMIN,
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
