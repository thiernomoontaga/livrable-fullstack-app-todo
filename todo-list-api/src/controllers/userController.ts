import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { createUserSchema, loginSchema } from '../utils/validation';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await userService.register(data);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const { user, token } = await userService.login(data);
      res.json({ success: true, data: { user, token } });
    } catch (error) {
      next(error);
    }
  }
}