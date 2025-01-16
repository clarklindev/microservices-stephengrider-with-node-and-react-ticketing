import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

import { validateRequest, BadRequestError } from '@clarklindev/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20 characters'),
  ],

  validateRequest,

  //validation using express-validator
  async (req: Request, res: Response) => {
    //(error checking moved to middlewares/validate-requests.ts)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array());
    // }

    //check if user exists
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log('email in use');
      // return res.send({});
      throw new BadRequestError('Email in use');
    }

    //password hash
    //NOTE THIS IS HANDLED AS MIDDLEWARE BY auth/src/services/passwords.ts

    //create user
    const user = User.build({ email, password });
    await user.save(); //save to db
    //generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id, //id from mongodb
        email: user.email,
      },
      // 'asdf' //signing key NOTE: for production this should go in kubernetes
      process.env.JWT_KEY!
    );

    //store on req.session object
    req.session = {
      jwt: userJwt
    };

    //send response
    res.status(201).send(user);
  }
);

export { router as signupRouter };
