import { app } from "../../app";
import request from "supertest";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

//TODO: test to ensure the request does NOT return a 404 (app.ts throws NotFoundError as catchall route when invalid url)
it('has a route handler to handle listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

//microservices-stephengrider-with-node-and-react-common/src/errors/ NotAuthorizedError -> throws 401
//BEFORE: test fails because there is no authentication tied to tickets/ route handler 
  // - our test is expecting a 401, but it is passing and returning 200  
//FIX: add middleware
it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
  
  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);
  
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);

});

it('returns an error if invalid price is provided', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'sdfsdfsfd',
    price: -10
  })
  .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdfsdfsfd',
    })
    .expect(400);
});

it('creates a ticket given valid inputs', async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);
  const title = "adsfjsdfdslf";
  const price = 20;

  //create ticket
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);

});

it('publishes an event', async () => {
  //create a new ticket
  const title = "adsfjsdfdslf";
  const price = 20;

  //create ticket
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);
  
  //publish function should have been called...
  console.log(natsWrapper);

  //check that publish() function gets invoked after creating a ticket
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  
});