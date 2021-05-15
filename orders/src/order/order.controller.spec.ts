import { Repository } from 'typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ordersFixture, dataCreateOrder } from './orders.fixture';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    orderController = app.get<OrderController>(OrderController);
    orderRepository = app.get<Repository<Order>>(getRepositoryToken(Order));
    orderRepository.find = jest.fn().mockResolvedValue(ordersFixture)
    orderRepository.findOne = jest.fn().mockResolvedValue(ordersFixture[0])
    orderRepository.update = jest.fn().mockResolvedValue(ordersFixture)
    orderRepository.insert = jest.fn().mockResolvedValue(ordersFixture)

    orderRepository.createQueryBuilder = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(ordersFixture[0])
    })
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      orderRepository.find
      const req = {user: {username: 'admin'}};
      const result = await orderController.findAll(req) as any;
      expect(result.list_orders).toEqual(ordersFixture);
      expect(result.last_modified).toEqual(ordersFixture[0].updateTimestamp);
    });
  });

  describe('createOrder', () => {
    it('should return info of new order', async () => {
      const result = await orderController.create(dataCreateOrder) as any;
      
      expect(1).toEqual(1);
      expect(result.name).toEqual(dataCreateOrder.name);
      expect(result.address).toEqual(dataCreateOrder.address);
      expect(result.price).toEqual(dataCreateOrder.price);
    });
  });

  describe('cancelOrder', () => {
    it('should return true', async () => {
      const result = await orderController.cancel(1) as any;
      
      expect(result.success).toEqual(true);
      expect(result.message).toEqual('Cancel order successfull.');
    });
  });

  describe('findOne', () => {
    it('should return order info', async () => {
      const result = await orderController.findOne(1) as any;
      expect(result).toEqual(ordersFixture[0]);
    });
  });

  describe('fetchListOrder', () => {
    it('should return order info', async () => {
      const params= {last_modified: new Date('2020-12-31')}
      const result = await orderController.fetchListOrder(params) as any;
      
      expect(result.has_new_data).toEqual(true);
    });
  });
});
