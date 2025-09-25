import { TodoRepository } from '../repositories/todoRepository';
import { TodoLogRepository } from '../repositories/todoLogRepository';
import { UserService } from './userService';
import { Todo, CreateTodoDto, UpdateTodoDto, AssignTodoDto, PaginatedResponse } from '../types';

export class TodoService {
  private todoRepository = new TodoRepository();
  private todoLogRepository = new TodoLogRepository();
  private userService = new UserService();

  async create(data: CreateTodoDto, ownerId: number): Promise<Todo> {
    const todo = await this.todoRepository.create({ ...data, ownerId });
    await this.logAction(todo.id, ownerId, 'created');
    return todo;
  }

  async getById(id: number): Promise<Todo | null> {
    return this.todoRepository.findById(id);
  }

  async getByOwner(ownerId: number, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Todo>> {
    const { todos, total } = await this.todoRepository.findByOwner(ownerId, page, limit);
    return { data: todos, total, page, limit };
  }

  async getAssignedTo(assignedToId: number, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Todo>> {
    const { todos, total } = await this.todoRepository.findAssignedTo(assignedToId, page, limit);
    return { data: todos, total, page, limit };
  }

  async update(id: number, data: UpdateTodoDto, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new Error('Todo not found');
    if (todo.ownerId !== userId) throw new Error('Unauthorized');
    const updated = await this.todoRepository.update(id, data);
    await this.logAction(id, userId, 'updated');
    return updated;
  }

  async assign(id: number, data: AssignTodoDto, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new Error('Todo not found');
    if (todo.ownerId !== userId) throw new Error('Unauthorized');
    const assignedUser = await this.userService.getUserById(data.assignedToId);
    if (!assignedUser) throw new Error('Assigned user not found');
    const updated = await this.todoRepository.assign(id, data.assignedToId);
    await this.logAction(id, userId, 'assigned', `Assigned to ${assignedUser.name}`);
    return updated;
  }

  async markComplete(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new Error('Todo not found');
    if (todo.ownerId !== userId && todo.assignedToId !== userId) throw new Error('Unauthorized');
    const updated = await this.todoRepository.update(id, { completed: true });
    await this.logAction(id, userId, 'completed');
    return updated;
  }

  async delete(id: number, userId: number): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new Error('Todo not found');
    if (todo.ownerId !== userId) throw new Error('Unauthorized');
    await this.todoRepository.delete(id);
    await this.logAction(id, userId, 'deleted');
  }

  private async logAction(todoId: number, userId: number, action: string, details?: string): Promise<void> {
    await this.todoLogRepository.create({ todoId, userId, action, details });
  }
}

