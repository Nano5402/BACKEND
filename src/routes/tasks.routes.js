import express from 'express';
import { 
  getTasks, getTaskById, createTask, updateTask, deleteTask,
  assignTaskToUsers, getTaskUsers, removeUserFromTask, filterTasks,
  patchTaskStatus, getDashboard
} from '../controllers/tasks.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { createTaskSchema } from '../schemas/task.schema.js';

const tasksRouter = express.Router();

// RUTAS ESPECÍFICAS (Deben ir arriba)
tasksRouter.get('/filter', verifyToken, isAdmin, filterTasks);
tasksRouter.get('/dashboard', verifyToken, isAdmin, getDashboard);

// RUTAS CRUD PRINCIPALES
tasksRouter.get('/', verifyToken, isAdmin, getTasks); 
tasksRouter.post('/', verifyToken, isAdmin, validateSchema(createTaskSchema), createTask);
tasksRouter.get('/:id', verifyToken, getTaskById); 
tasksRouter.put('/:id', verifyToken, isAdmin, updateTask);
tasksRouter.delete('/:id', verifyToken, isAdmin, deleteTask);

// RUTA DE ESTADO (Permite a los estudiantes cambiar el estado)
tasksRouter.patch('/:id/status', verifyToken, patchTaskStatus);

// RUTAS DE ASIGNACIÓN (Compatibilidad con el Frontend)
tasksRouter.post('/:taskId/assign', verifyToken, isAdmin, assignTaskToUsers);
tasksRouter.get('/:taskId/users', verifyToken, isAdmin, getTaskUsers);
tasksRouter.delete('/:taskId/users/:userId', verifyToken, isAdmin, removeUserFromTask);

export default tasksRouter;