import request from 'supertest';
import {app} from '../../app';

//- TODO: test when signin with account not in db or never signed up before, then should get -> 400 error
it('fails when an email that does not exist is supplied', async ()=>{
  await request(app)
    .post('/api/users/signin')
    .send({
      email:'test@test.com', 
      password: 'password'
    })
    .expect(400);
});

//- TODO: test incorrect password -> 400 error
it('fails when an incorrect password is supplied', async ()=>{

  //sign up
  await request(app)
    .post('/api/users/signup')
    .send({
      email:'test@test.com', 
      password: 'password'
    })
    .expect(201);

  //sign in
  await request(app)
    .post('/api/users/signin')
    .send({
      email:'test@test.com', 
      password: 'asdasddfdgfgdgd'
    })
    .expect(400);
});

//- TODO: test cookie should be in header if correct credentials used to sign in
it('fails when an email that does not exist is supplied', async ()=>{
  await request(app)
    .post('/api/users/signup')
    .send({
      email:'test@test.com', 
      password: 'password'
    })
    .expect(201);

  //sign in
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email:'test@test.com', 
      password: 'password'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
  
});