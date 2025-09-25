import prisma from '../utils/database';
import { TodoLog } from '../types';

export class TodoLogRepository {
  async create(data: Omit<TodoLog, 'id' | 'timestamp'>): Promise<TodoLog> {
    return prisma.todoLog.create({ data });
  }

  async findByTodoId(todoId: number): Promise<TodoLog[]> {
    return prisma.todoLog.findMany({ where: { todoId }, orderBy: { timestamp: 'desc' } });
  }

  async findByUserId(userId: number): Promise<TodoLog[]> {
    return prisma.todoLog.findMany({ where: { userId }, orderBy: { timestamp: 'desc' } });
  }
}