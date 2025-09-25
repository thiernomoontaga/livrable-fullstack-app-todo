import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const assignTodoSchema = z.object({
  assignedToId: z.number().int().positive(),
});

export const paginationSchema = z.object({
  page: z.string().transform((val: string) => parseInt(val)).refine((val: number) => val > 0, { message: "Page must be positive" }).optional(),
  limit: z.string().transform((val: string) => parseInt(val)).refine((val: number) => val > 0, { message: "Limit must be positive" }).optional(),
});

