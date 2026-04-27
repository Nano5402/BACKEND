import express from 'express';
import { 
  getTasks, getTaskById, createTask, updateTask, deleteTask,
  assignTaskToUsers, getTaskUsers, removeUserFromTask, filterTasks,
  patchTaskStatus, getDashboard
} from '../controllers/tasks.controller.js';
import { verifyToken, checkPermission } from '../middlewares/auth.middleware.js'; //  Importamos el Guardián
import { validateSchema } from '../middlewares/validate.middleware.js';
import { createTaskSchema, updateTaskSchema, assignTaskSchema, filterTaskQuerySchema } from '../schemas/task.schema.js'; 
import { PERMISSIONS } from '../constants/permissions.js'; //  Importamos las constantes

const tasksRouter = express.Router();

// RUTAS ESPECÍFICAS
tasksRouter.get('/filter', verifyToken, checkPermission(PERMISSIONS.TASKS_READ_ALL), validateSchema(filterTaskQuerySchema, 'query'), filterTasks);
tasksRouter.get('/dashboard', verifyToken, checkPermission(PERMISSIONS.TASKS_READ_ALL), getDashboard);

// RUTAS CRUD PRINCIPALES
tasksRouter.get('/', verifyToken, checkPermission(PERMISSIONS.TASKS_READ_ALL), getTasks); 
tasksRouter.post('/', verifyToken, checkPermission(PERMISSIONS.TASKS_CREATE_MULTIPLE), validateSchema(createTaskSchema), createTask);
tasksRouter.get('/:id', verifyToken, getTaskById); // El controlador decide si es propia o general
tasksRouter.put('/:id', verifyToken, checkPermission(PERMISSIONS.TASKS_UPDATE_ALL), validateSchema(updateTaskSchema), updateTask);
tasksRouter.delete('/:id', verifyToken, checkPermission(PERMISSIONS.TASKS_DELETE_ALL), deleteTask);

// RUTA DE ESTADO (Cualquier usuario logueado con la tarea asignada puede intentar parchear)
tasksRouter.patch('/:id/status', verifyToken, patchTaskStatus);

// RUTAS DE ASIGNACIÓN 
tasksRouter.post('/:taskId/assign', verifyToken, checkPermission(PERMISSIONS.TASKS_CREATE_MULTIPLE), validateSchema(assignTaskSchema), assignTaskToUsers);
tasksRouter.get('/:taskId/users', verifyToken, checkPermission(PERMISSIONS.TASKS_READ_ALL), getTaskUsers);
tasksRouter.delete('/:taskId/users/:userId', verifyToken, checkPermission(PERMISSIONS.TASKS_UPDATE_ALL), removeUserFromTask);

export default tasksRouter;