import pool from '../config/db.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse } from '../utils/response.handler.js';
import { hashPassword } from '../utils/security.js'; // Importamos el encriptador

export const getUsers = catchAsync(async (req, res) => {
  // Traemos el nombre del rol para que el frontend lo pueda mostrar bonito
  const [rows] = await pool.query(`
    SELECT u.id, u.name, u.email, u.document, u.status, u.createdAt, u.role_id, r.name as role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.id
  `);
  return successResponse(res, 200, "Usuarios obtenidos correctamente", rows);
});

export const getUserById = catchAsync(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT u.id, u.name, u.email, u.document, u.status, u.createdAt, u.role_id, r.name as role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [req.params.id]);
  
  if (rows.length === 0) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }
  
  return successResponse(res, 200, "Usuario encontrado", rows[0]);
});

export const createUser = catchAsync(async (req, res) => {
  const { name, email, document, role_id } = req.body;
  
  // 🔥 Contraseña temporal automática (últimos 4 dígitos) para no dejar huecos de seguridad
  const tempPassword = document.slice(-4);
  const hashedPassword = await hashPassword(tempPassword);

  const [result] = await pool.query(
    'INSERT INTO users (name, email, document, password, role_id, status) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, document, hashedPassword, role_id || 3, 'activo']
  );
  
  return successResponse(res, 201, "Usuario creado con éxito", { id: result.insertId });
});

export const updateUser = catchAsync(async (req, res) => {
  const { name, email, document, role_id, status } = req.body;
  
  const [result] = await pool.query(
    'UPDATE users SET name = ?, email = ?, document = ?, role_id = ?, status = ? WHERE id = ?',
    [name, email, document, role_id, status, req.params.id]
  );

  if (result.affectedRows === 0) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }

  return successResponse(res, 200, "Usuario actualizado correctamente");
});

export const deleteUser = catchAsync(async (req, res) => {
  const [result] = await pool.query("UPDATE users SET status = 'inactivo' WHERE id = ?", [req.params.id]);
  
  if (result.affectedRows === 0) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }

  return successResponse(res, 200, "Usuario desactivado correctamente");
});

export const patchUserStatus = catchAsync(async (req, res) => {
  const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
  
  if (result.affectedRows === 0) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }

  return successResponse(res, 200, "Estado actualizado correctamente");
});