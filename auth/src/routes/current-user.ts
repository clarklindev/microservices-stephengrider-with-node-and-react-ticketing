import express, {Request, Response} from 'express';

import { currentUser } from '@clarklindev/common';

const router = express.Router();

//postman GET: https://ticketing.dev/api/users/currentuser
router.get('/api/users/currentuser', currentUser, (req:Request, res:Response) => {
  console.log('currentUser: ', req.currentUser);
  res.send({currentUser: req.currentUser || null});
});

export { router as currentUserRouter };
