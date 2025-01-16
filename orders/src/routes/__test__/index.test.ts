import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  return ticket;
}

it('fetches order for a particular user', async ()=>{
    //create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    //create one order as User #1
    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ticketId: ticketOne.id})
      .expect(201);

    //create 2x orders as User #2
    //desctruct the returned object from request 
    //AND automatically rename as orderOne
    const {body: orderOne} = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ticketId: ticketTwo.id})
      .expect(201);

    //desctruct the returned object from request 
    //AND automatically rename as orderTwo
    const {body: orderTwo} = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ticketId: ticketThree.id})
      .expect(201);      
      
    //make request to fetch all orders for User #2
    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .expect(200);

    console.log(response.body);

    //make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);

    //testing the ticket by id
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);


});