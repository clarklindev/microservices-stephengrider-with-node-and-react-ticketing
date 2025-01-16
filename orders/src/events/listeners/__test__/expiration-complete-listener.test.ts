import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, ExpirationCompleteEvent} from '@clarklindev/common';
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () =>{
//create an instance of the listener
const listener = new ExpirationCompleteListener(natsWrapper.client);

const ticket = Ticket.build({
  id: new mongoose.Types.ObjectId().toHexString(),
  title: 'concert',
  price: 15
});
await ticket.save();

const order = Order.build({
  status: OrderStatus.Created,
  userId: '32423fcdsfs',  //dont matter
  expiresAt: new Date(),  //dont matter
  ticket
});
await order.save();

const data:ExpirationCompleteEvent['data'] = {
  orderId: order.id
}

//@ts-ignore
const msg: Message = {
  ack: jest.fn()
}

return { listener, order, ticket, data, msg };
};


it('updates the orders status to cancelled', async ()=>{
  const {listener, order, ticket, data, msg} = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status)
});

it('emits an OrderCancelled event', async ()=>{
  const {listener, order, ticket, data, msg} = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();  

  //publish should be invoked once, so we look at calls[0]
  //and we access calls[0][1] because 1st argument is subject, 2nd arg is msg object
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async ()=>{
  const {listener, order, ticket, data, msg} = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});