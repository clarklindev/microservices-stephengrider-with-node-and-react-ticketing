import request from 'supertest';
import {app} from '../../app';

it('returns a 201 on successful signup', async ()=>{
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async ()=> {
  return request(app)
    .post('/api/users/signup')
    .send({
      email:'alskdflaskjfd',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async ()=> {
  return request(app)
    .post('/api/users/signup')
    .send({
      email:'test@test.com',
      password: 'p'
    })
    .expect(400);
});

it('returns a 400 with missing email AND password', async ()=> {
  //valid email missing password
  await request(app)
    .post('/api/users/signup')
    .send({
      email:'test@test.com',
    })
    .expect(400); 

  //valid password missing email
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password'
    })
    .expect(400);
});


//dissallow signing up with same email
//NOTE: when running each test, it assumes the
it('dissallows duplicate emails', async ()=>{
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () =>{
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
})