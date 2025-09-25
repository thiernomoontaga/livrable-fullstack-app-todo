import { Response, NextFunction } from 'express';
import { TodoService } from '../services/todoService';
import { createTodoSchema, updateTodoSchema, assignTodoSchema, paginationSchema } from '../utils/validation';
import { AuthRequest } from '../types';

const todoService = new TodoService();

export class TodoController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createTodoSchema.parse(req.body);
      const todo = await todoService.create(data, req.user!.id);
      res.status(201).json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const todos = await todoService.getByOwner(req.user!.id, page, limit);
      res.json({ success: true, data: todos });
    } catch (error) {
      next(error);
    }
  }

  async getAssigned(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const todos = await todoService.getAssignedTo(req.user!.id, page, limit);
      res.json({ success: true, data: todos });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateTodoSchema.parse(req.body);
      const todo = await todoService.update(parseInt(id), data, req.user!.id);
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }

  async assign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = assignTodoSchema.parse(req.body);
      const todo = await todoService.assign(parseInt(id), data, req.user!.id);
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }

  async markComplete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const todo = await todoService.markComplete(parseInt(id), req.user!.id);
      res.json({ success: true, data: todo });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await todoService.delete(parseInt(id), req.user!.id);
      res.json({ success: true, message: 'Todo deleted' });
    } catch (error) {
      next(error);
    }
  }
}

