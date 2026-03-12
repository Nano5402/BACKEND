import express from 'express';
import { 
  getTasks, getTaskById, createTask, updateTask, deleteTask,
  assignTaskToUsers, getTaskUsers, removeUserFromTask, filterTasks
} from '../controllers/tasks.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const tasksRouter = express.Router();

// RUTA DE FER: Filtro de tareas (Solo Administradores)
// ¡Debe ir antes de router.get('/:id')!
tasksRouter.get('/filter', verifyToken, isAdmin, filterTasks);

// TUS RUTAS CRUD
tasksRouter.get('/', verifyToken, isAdmin, getTasks);
tasksRouter.post('/', verifyToken, isAdmin, createTask);
tasksRouter.get('/:id', verifyToken, getTaskById); 
tasksRouter.put('/:id', verifyToken, isAdmin, updateTask);
tasksRouter.delete('/:id', verifyToken, isAdmin, deleteTask);

// TUS RUTAS DE ASIGNACIÓN
tasksRouter.post('/:taskId/assign', verifyToken, isAdmin, assignTaskToUsers);
tasksRouter.get('/:taskId/users', verifyToken, isAdmin, getTaskUsers);
tasksRouter.delete('/:taskId/users/:userId', verifyToken, isAdmin, removeUserFromTask);

export default tasksRouter;