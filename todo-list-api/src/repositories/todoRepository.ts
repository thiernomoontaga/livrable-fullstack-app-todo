import prisma from '../utils/database';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types';

export class TodoRepository {
  async create(data: CreateTodoDto & { ownerId: number }): Promise<Todo> {
    return prisma.todo.create({ data });
  }

  async findById(id: number): Promise<Todo | null> {
    return prisma.todo.findUnique({ where: { id } });
  }

  async findByOwner(ownerId: number, page: number = 1, limit: number = 10): Promise<{ todos: Todo[], total: number }> {
    const skip = (page - 1) * limit;
    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where: { ownerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.todo.count({ where: { ownerId } })
    ]);
    return { todos, total };
  }

  async findAssignedTo(assignedToId: number, page: number = 1, limit: number = 10): Promise<{ todos: Todo[], total: number }> {
    const skip = (page - 1) * limit;
    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where: { assignedToId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.todo.count({ where: { assignedToId } })
    ]);
    return { todos, total };
  }

  async update(id: number, data: UpdateTodoDto): Promise<Todo> {
    return prisma.todo.update({ where: { id }, data });
  }

  async assign(id: number, assignedToId: number): Promise<Todo> {
    return prisma.todo.update({ where: { id }, data: { assignedToId } });
  }

  async delete(id: number): Promise<void> {
    await prisma.todo.delete({ where: { id } });
  }
}

