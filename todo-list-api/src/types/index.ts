export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  ownerId: number;
  assignedToId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoLog {
  id: number;
  action: string;
  todoId: number;
  userId: number;
  timestamp: Date;
  details?: string | null;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface AssignTodoDto {
  assignedToId: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}


export interface AuthRequest {
  user?: User;
  body: any;
  params: any;
  query: any;
}

