import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/User';
import { BaseController } from '@src/controllers';
import { AuthService } from '@src/services/auth';
import { authMiddleware } from '@src/middlewares/auth';
import logger from '@src/logger';
import mongoose from 'mongoose';

@Controller('api/users')
export class UsersController extends BaseController {
  @Post('')
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error: any) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found',
        description: 'Try verifying your email address.',
      });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match',
      });
    }
    //generating token
    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ token });
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.decoded ? req.decoded.email : undefined;

    const user = await User.findOne({ email });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!',
      });
    }

    return res.send({ user });
  }
}
