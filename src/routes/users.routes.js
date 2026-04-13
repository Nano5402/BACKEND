import express from 'express';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';
import { getUsers, getUserById, createUser, updateUser, deleteUser, patchUserStatus } from '../controllers/users.controller.js';
import { getTasksByUser } from '../controllers/tasks.controller.js';
import { updateUserSchema, createUserSchema } from '../schemas/user.schema.js';
import { validateSchema } from '../middlewares/validate.middleware.js';

const usersRouter = express.Router();

// RUTA DE FER: Ver mis tareas (Cualquier usuario logueado)
usersRouter.get('/:userId/tasks', verifyToken, getTasksByUser);

// CRUD DE USUARIOS (Solo Admin)
usersRouter.get('/', verifyToken, isAdmin, getUsers);
usersRouter.get('/:id', verifyToken, isAdmin, getUserById);

// Registro de usuario con validación y seguridad
usersRouter.post('/', verifyToken, isAdmin, validateSchema(createUserSchema), createUser);

// Actualización de usuario con seguridad y esquema
usersRouter.put('/:id', verifyToken, isAdmin, validateSchema(updateUserSchema), updateUser);

usersRouter.delete('/:id', verifyToken, isAdmin, deleteUser);
usersRouter.patch('/:id/status', verifyToken, isAdmin, patchUserStatus);

export default usersRouter;