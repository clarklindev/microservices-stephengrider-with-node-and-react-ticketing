import {MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

//UPDATE
declare global {
  var signin: () => string[];
}

//OLDER
// declare global {
//   var signin: () => Promise<string[]>;
// }

//OLDEST
// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

jest.mock('../nats-wrapper');

let mongo:any;

beforeAll(async ()=>{
  process.env.JWT_KEY = 'adsopsdfisd';

  //OLD WAY
  // const mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

// await mongoose.connect(mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  
  if(mongoose.connection.db){
    const collections = await mongoose.connection.db?.collections();
  
    for(let collection of collections){
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

//get cookie
global.signin = ()=> {
  //1. build a jwt payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  //2. create the jwt (need process.env.JWT_KEY)
  const token = jwt.sign(payload, process.env.JWT_KEY!);

   //3. build sesion object {jwt: MY_JWT}
   const session = {jwt: token};

   //4. turn session into JSON
   const sessionJSON = JSON.stringify(session);
 
   //5. take JSON and encode it as base64
   const base64 = Buffer.from(sessionJSON).toString('base64');
 
   //6. return a string with cookie: express:sess=cookie 
   return [`session=${base64}`];

}