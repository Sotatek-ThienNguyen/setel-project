import { CreatePaymentDto } from './dto/create-payment.dto';
import { Status} from './payment.entity';

export const paymentsFixture = [
    {
      id: 1,
      name: 'Laptop',
      address: 'Hanoi',
      price: 1000,
      orderNumber: 'abx232s',
      status: Status.CONFIRMED,
      createdBy: 1,
      createTimestamp: new Date('2021-12-23'),
      updateTimestamp: new Date('2021-12-23'),
    },
    {
      id: 2,
      name: 'Iphone 6S',
      address: 'HoChiMinh City',
      price: 800,
      orderNumber: 'n37sbu8',
      status: Status.CANCELLED,
      createdBy: 1,
      createTimestamp: new Date('2021-01-02'),
      updateTimestamp: new Date('2021-01-02'),
    },
    {
      id: 3,
      name: 'Apple watch',
      address: 'Hanoi',
      price: 200,
      orderNumber: '1mn6fd1',
      status: Status.CONFIRMED,
      createdBy: 1,
      createTimestamp: new Date('2020-12-23'),
      updateTimestamp: new Date('2020-12-23'),
    },
];

export const dataCreatePayment: CreatePaymentDto = {
  name: "Motorbike",
  address: "New York",
  price: 4000,
  orderNumber: "zo4o4hme",
  createdBy: 1
};