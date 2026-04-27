import pool from '../config/db.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse } from '../utils/response.handler.js';
import { hashPassword, comparePassword, generateTokens } from '../utils/security.js';
import jwt from 'jsonwebtoken';

export const register = catchAsync(async (req, res) => {
  // Ahora recibimos role_id en lugar del string role
  const { name, email, document, password, role_id } = req.body;

  if (!name || !email || !document || !password) {
    const error = new Error("Todos los campos (nombre, email, documento, contraseña) son obligatorios");
    error.statusCode = 400;
    error.isOperational = true;
    throw error;
  }

  const [existingUsers] = await pool.query('SELECT id FROM users WHERE document = ? OR email = ?', [document, email]);
  if (existingUsers.length > 0) {
    const error = new Error("El documento o correo ya están registrados en el sistema");
    error.statusCode = 409;
    error.isOperational = true;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  
  // Por defecto, si no envían rol, le asignamos el 3 (Estudiante)
  const userRoleId = role_id || 3;

  const [result] = await pool.query(
    'INSERT INTO users (name, email, document, password, role_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, document, hashedPassword, userRoleId]
  );

  return successResponse(res, 201, "Usuario registrado exitosamente", {
    userId: result.insertId
  });
});

export const login = catchAsync(async (req, res) => {
  const { document, password } = req.body;

  if (!document || !password) {
    const error = new Error("El documento y la contraseña son obligatorios para iniciar sesión");
    error.statusCode = 400;
    error.isOperational = true;
    throw error;
  }

  // 🔥 MAGIA RBAC 1: Traemos al usuario con el nombre de su rol
  const [users] = await pool.query(`
    SELECT u.*, r.name as role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.document = ?
  `, [document]);

  if (users.length === 0) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    error.isOperational = true;
    throw error;
  }

  const user = users[0];

  if (user.status === 'inactivo') {
    const error = new Error("El usuario se encuentra inactivo. Contacte al administrador.");
    error.statusCode = 403;
    error.isOperational = true;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    error.isOperational = true;
    throw error;
  }

  // 🔥 MAGIA RBAC 2: Extraemos los permisos atómicos desde la tabla pivote
  const [permissionsData] = await pool.query(`
    SELECT p.name 
    FROM role_permissions rp
    JOIN permissions p ON rp.permission_id = p.id
    WHERE rp.role_id = ?
  `, [user.role_id]);

  // Convertimos el array de objetos a un array de strings planos ['users.create', 'tasks.read.all']
  user.permissions = permissionsData.map(p => p.name);

  // Generamos los tokens incluyendo esta nueva data
  const { accessToken, refreshToken } = generateTokens(user);

  return successResponse(res, 200, "Inicio de sesión exitoso", {
    user: { id: user.id, name: user.name, role: user.role_name, role_id: user.role_id, permissions: user.permissions },
    accessToken,
    refreshToken
  });
});

export const renewToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const error = new Error("Se requiere el Refresh Token para renovar la sesión");
    error.statusCode = 400;
    error.isOperational = true;
    throw error;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generamos un nuevo par de tokens inyectando los datos que ya teníamos decodificados
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: decoded.id,
      role_name: decoded.role,
      role_id: decoded.role_id,
      permissions: decoded.permissions
    });

    return successResponse(res, 200, "Token renovado exitosamente", {
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ ok: false, msn: "Su sesión ha expirado completamente. Por favor, inicie sesión de nuevo." });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ ok: false, msn: "Refresh token inválido o corrupto." });
    }
    const err = new Error("Error interno al renovar el token");
    err.statusCode = 500;
    err.isOperational = true;
    throw err;
  }
});