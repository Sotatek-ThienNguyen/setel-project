import { Repository } from 'typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment, Status } from './payment.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paymentsFixture, dataCreatePayment } from './payment.fixture';
import { HttpStatus } from '@nestjs/common';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentRepository: Repository<Payment>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository,
        },
      ],
    }).compile();

    paymentController = app.get<PaymentController>(PaymentController);
    paymentRepository = app.get<Repository<Payment>>(getRepositoryToken(Payment));
    jest.spyOn(paymentRepository, 'find').mockResolvedValueOnce(Promise.resolve(paymentsFixture));
  });
  
  describe('findAll', () => {
    it('should return an array of payments', async () => {
      const result = await paymentController.findAll();
      expect(result).toEqual(paymentsFixture);
    });
  });
  
  describe('create without exist record', () => {
      it('should return the payment', async () => {
        jest.spyOn(paymentRepository, 'findOneOrFail').mockResolvedValueOnce(null);
        const newPayment = await paymentController.create(dataCreatePayment)

        expect(newPayment.name).toEqual(dataCreatePayment.name);
        expect(newPayment.address).toEqual(dataCreatePayment.address);
        expect(newPayment.price).toEqual(dataCreatePayment.price);
        expect(newPayment.status === Status.CANCELLED || newPayment.status === Status.CONFIRMED).toEqual(true);
      });
  });

  describe('create with exist record', () => {
    it('should return the payment', async () => {
      jest.spyOn(paymentRepository, 'findOneOrFail').mockResolvedValueOnce(Promise.resolve(paymentsFixture[0]));
      try {
        await paymentController.create(dataCreatePayment)
      } catch (error) {
        expect(error.response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
