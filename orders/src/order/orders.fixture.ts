import {Status} from '../order/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
export const ordersFixture = [
    {
      id: 1,
      name: 'Laptop',
      address: 'Hanoi',
      price: 1000,
      nmbr: 'abx232s',
      status: Status.CREATED,
      createdBy: 1,
      createTimestamp: new Date('2021-12-23'),
      updateTimestamp: new Date('2021-12-23'),
    },
    {
      id: 2,
      name: 'Iphone 6S',
      address: 'HoChiMinh City',
      price: 800,
      nmbr: 'n37sbu8',
      status: Status.CREATED,
      createdBy: 1,
      createTimestamp: new Date('2021-01-02'),
      updateTimestamp: new Date('2021-01-02'),
    },
    {
      id: 3,
      name: 'Apple watch',
      address: 'Hanoi',
      price: 200,
      nmbr: '1mn6fd1',
      status: Status.CREATED,
      createdBy: 1,
      createTimestamp: new Date('2020-12-23'),
      updateTimestamp: new Date('2020-12-23'),
    },
];

export const dataCreateOrder: CreateOrderDto = {
    name: 'test',
    price: 100,
    address: 'Hanoi'
}