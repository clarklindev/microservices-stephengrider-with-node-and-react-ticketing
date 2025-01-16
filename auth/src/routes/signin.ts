import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@clarklindev/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

//postman POST: https://ticketing.dev/api/users/signin
router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('email invalid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('you must supply a password'),
  ],

  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    //generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },
      // 'asdf' //signing key NOTE: for production this should go in kubernetes (see infra/k8s/)
      process.env.JWT_KEY!
    );

    console.log('userJwt: ', userJwt);

    //store on req.session object
    req.session = {
      jwt: userJwt
    };

    //send response
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
