import { Router } from 'express';
import { TodoController } from '../controllers/todoController';

const router = Router();
const todoController = new TodoController();

router.post('/', todoController.create.bind(todoController));
router.get('/', todoController.getAll.bind(todoController));
router.get('/assigned', todoController.getAssigned.bind(todoController));
router.put('/:id', todoController.update.bind(todoController));
router.patch('/:id/assign', todoController.assign.bind(todoController));
router.patch('/:id/complete', todoController.markComplete.bind(todoController));
router.delete('/:id', todoController.delete.bind(todoController));

export default router;

