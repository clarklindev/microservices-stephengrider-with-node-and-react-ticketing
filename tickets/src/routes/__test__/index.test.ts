import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'adasdasda',
      price: 20
    });
}

it('can fetch a list of tickets', async () => {
  
  //create 3x tickets
  await createTicket();
  await createTicket();
  await createTicket();

  //make a request to api and expect length of 3 in response
  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);
  
  expect(response.body.length).toEqual(3);

});