import request from 'supertest';
import {app} from '../../app';

it('responds with details about the current user', async ()=>{

  //OLD
  // //signup so we have a user
  // const authResponse = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     email:'test@test.com',
  //     password: 'password'
  //   })
  //   .expect(201);

  // //get cookie from response
  // const cookie = authResponse.get('Set-Cookie');
  // if (!cookie) {
  //   throw new Error("Cookie not set after signup");
  // }

  //UPDATE
  const cookie = await global.signin();

  //make a request
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(400);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async ()=>{
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});