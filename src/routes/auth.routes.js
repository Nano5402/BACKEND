import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../schemas/auth.schema.js';
const authRouter = express.Router();

authRouter.post('/login', validateSchema(loginSchema), login);
export default authRouter;
