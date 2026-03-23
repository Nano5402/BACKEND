import pool from '../config/db.js';

// RF03: Consultar todos los usuarios (ISA - REFACTORIZADO A MYSQL)
const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error en getUsers:", error.message);
    res.status(500).json({ msn: "Error al obtener usuarios de la base de datos" });
  }
};

// RF03: Consultar por ID (ISA - REFACTORIZADO A MYSQL)
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (rows.length === 0) return res.status(404).json({ msn: "Usuario no encontrado" });
    
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ msn: "Error al buscar el usuario en la base de datos" });
  }
};

// RF02: Crear usuario (CREATE en MySQL)
const createUser = async (req, res) => {
  const { name, email, document, role } = req.body;

  try {
    if (!name || !email || !document) {
      return res.status(400).json({ msn: "name, email y document son obligatorios" });
    }

    const roleValue = role || "user";
    const statusValue = "activo";

    const [result] = await pool.query(
      'INSERT INTO users (name, email, document, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, document, roleValue, statusValue]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ msn: "Usuario creado correctamente", data: rows[0] });
  } catch (error) {
    console.error("Error en createUser:", error.message);
    res.status(500).json({ msn: "Error al crear usuario en la base de datos" });
  }
};

// RF04: Actualizar usuario (UPDATE en MySQL)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, document, role, status } = req.body;

  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ msn: "Usuario no encontrado" });
    }

    const [currentRows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const currentUser = currentRows[0];

    const nextName = name ?? currentUser.name;
    const nextEmail = email ?? currentUser.email;
    const nextDocument = document ?? currentUser.document;
    const nextRole = role ?? currentUser.role;
    const nextStatus = status ?? currentUser.status;

    await pool.query(
      'UPDATE users SET name = ?, email = ?, document = ?, role = ?, status = ? WHERE id = ?',
      [nextName, nextEmail, nextDocument, nextRole, nextStatus, id]
    );

    const [updatedRows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.status(200).json({ msn: "Usuario actualizado correctamente", data: updatedRows[0] });
  } catch (error) {
    console.error("Error en updateUser:", error.message);
    res.status(500).json({ msn: "Error al actualizar usuario en la base de datos" });
  }
};

// RF05: Eliminar usuario (ISA - REFACTORIZADO A MYSQL)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ msn: "El usuario no existe en la base de datos" });
    
    res.status(200).json({ msn: "Usuario eliminado correctamente de MySQL" });
  } catch (error) {
    res.status(500).json({ msn: "Error al eliminar de la base de datos" });
  }
};

const patchUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ msn: "El campo status es obligatorio" });
    }

    const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msn: "Usuario no encontrado" });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.status(200).json({ msn: "Estado actualizado", data: rows[0] });
  } catch (error) {
    console.error("Error en patchUserStatus:", error.message);
    res.status(500).json({ msn: "Error al cambiar estado en base de datos" });
  }
};

export { getUsers, getUserById, createUser, updateUser, deleteUser, patchUserStatus };