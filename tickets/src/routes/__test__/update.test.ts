//tickets/src/routes/__test__/update.test.ts

import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin()) //is logged in
    .send({
      title: 'sdfsdfdsf',
      price: 20
    })
    .expect(404);
});

it('returns a 401 (not allowed) if user not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sdfsdfdsf',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {

  //create a ticket
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'sfddsfsd',
      price: 20
    });

  //...edit a ticket
  //currently it will use the same cookie
  //...

  //AFTER UPDATE (tickets/src/test/setup.ts)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin()) //new user
    .send({
      title: 'asddasd',
      price: 20
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {

  const cookie = global.signin();

  //create a ticket
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'sfddsfsd',
    price: 20
  });

  //make a request to update - invalid title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400);
  
  //make a request to update - invalid price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdasddadsd',
      price: -20
    })
    .expect(400);
});

it('updates the ticket if provided valid inputs - happy test', async () => {
  const cookie = global.signin();

  //create a ticket
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'sfddsfsd',
    price: 20
  });

  //update ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);
  
  //fetch the ticket again
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  
  expect(ticketResponse.body.title).toEqual('new title'); 
  expect(ticketResponse.body.price).toEqual(100); 
});



it('publishes an event', async ()=>{
  const cookie = global.signin();

  //create a ticket
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'sfddsfsd',
    price: 20
  });

  //update ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);
  
  expect(natsWrapper.client.publish).toHaveBeenCalled();

});

it('rejects updates if ticket is reserved', async ()=>{
  const cookie = global.signin();

  //create a ticket
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'sfddsfsd',
    price: 20
  });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});
  await ticket!.save();

  //update ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(400);
});