import express from 'express';
import { 
    login, 
    register, 
    renewToken,
    forgotPassword, // 🔥 Importamos las nuevas
    verifyOTP,
    resetPassword 
} from '../controllers/auth.controller.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../schemas/auth.schema.js';

const authRouter = express.Router();

// Ruta de registro
authRouter.post('/register', register);

// Ruta de login (mantenemos tu validación actual intacta)
authRouter.post('/login', validateSchema(loginSchema), login);

// Ruta para refrescar token
authRouter.post('/refresh', renewToken);

// =========================================================
// 🔥 RUTAS DE RECUPERACIÓN DE CONTRASEÑA (MAILTRAP + OTP)
// =========================================================
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/reset-password', resetPassword);

export default authRouter;