import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, patchUserStatus } from '../controllers/users.controller.js';
import { getTasksByUser } from '../controllers/tasks.controller.js'; //  Restaurado
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js'; 
import { updateUserSchema, createUserSchema } from '../schemas/user.schema.js';

const usersRouter = express.Router();

// RUTA DE FER: Ver mis tareas (Cualquier usuario logueado)
usersRouter.get('/:userId/tasks', verifyToken, getTasksByUser);

// CRUD DE USUARIOS (Solo Admin)
usersRouter.get('/', verifyToken, isAdmin, getUsers);
usersRouter.get('/:id', verifyToken, isAdmin, getUserById);

// Aplicación de validación Zod en creación y actualización
usersRouter.post('/', verifyToken, isAdmin, validateSchema(createUserSchema), createUser);
usersRouter.put('/:id', verifyToken, isAdmin, validateSchema(updateUserSchema), updateUser);

usersRouter.delete('/:id', verifyToken, isAdmin, deleteUser);
usersRouter.patch('/:id/status', verifyToken, isAdmin, patchUserStatus);

export default usersRouter;