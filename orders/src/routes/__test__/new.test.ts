import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async ()=>{
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId})
    .expect(404);
});

it('returns an error if the ticket is already reserved', async ()=>{
  // 1. create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  
  // 2. save to database
  await ticket.save();

  // 3. create an order
  const order = Order.build({
    ticket,
    userId: 'sdfksdfldsjf',
    status: OrderStatus.Created,
    expiresAt: new Date()
  })
  
  // 4. save to database 
  await order.save();

  // 5. then make the request
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(400);

});

it('reserves a ticket', async ()=>{
  // 1. create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  
  // 2. save to database
  await ticket.save();

  // 3. make a request to attempt to reserve ticket
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201);

});

it('emits an order created event', async () => {
  // 1. create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  // 2. save to database
  await ticket.save();

  // 3. make a request to attempt to reserve ticket
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

});