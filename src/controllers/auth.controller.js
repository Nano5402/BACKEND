import pool from '../config/db.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse } from '../utils/response.handler.js';
import { hashPassword, comparePassword, generateTokens } from '../utils/security.js';
import jwt from 'jsonwebtoken';

export const register = catchAsync(async (req, res) => {
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
  const userRoleId = role_id || 3; // 3 = Estudiante por defecto

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
    const error = new Error("El documento y la contraseña son obligatorios");
    error.statusCode = 400;
    error.isOperational = true;
    throw error;
  }

  // 1. Buscamos el usuario y hacemos JOIN para traer el nombre de su rol
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

  // 2. EXTRACCIÓN DE PERMISOS ATÓMICOS DESDE LA TABLA PIVOTE
  const [permissionsData] = await pool.query(`
    SELECT p.name 
    FROM role_permissions rp
    JOIN permissions p ON rp.permission_id = p.id
    WHERE rp.role_id = ?
  `, [user.role_id]);

  // Convertimos el resultado de SQL en un array plano de strings: ['users.create', 'tasks.read.all', ...]
  user.permissions = permissionsData.map(p => p.name);

  // 3. Generamos los tokens incluyendo este nuevo array de permisos
  const { accessToken, refreshToken } = generateTokens(user);

  return successResponse(res, 200, "Inicio de sesión exitoso", {
    user: { 
      id: user.id, 
      name: user.name, 
      role: user.role_name, 
      role_id: user.role_id, 
      permissions: user.permissions // Lo enviamos al frontend para que sepa qué botones ocultar
    },
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

    // Mantenemos la integridad de los permisos al renovar el token
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: decoded.id,
      role_name: decoded.role,
      role_id: decoded.role_id,
      permissions: decoded.permissions // Reinyectamos los permisos decodificados
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