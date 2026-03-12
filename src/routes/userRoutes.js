// ============================================================
// 🗺️ RUTAS DE USUARIOS — userRoutes.js
// ============================================================
// Este archivo maneja las rutas relacionadas con los USUARIOS.
//
// Aquí está el endpoint del REQUERIMIENTO 1:
// GET /api/users/:userId/tasks
//
// Nota: aunque la ruta parece de "tareas", vive en el archivo
// de usuarios porque responde a /api/users/...
// Esto tiene sentido: es una vista del usuario sobre sus propias tareas.
// ============================================================

const { Router } = require("express");

// Importamos el controlador de TAREAS porque la función que
// busca tareas por usuario está ahí (getTasksByUser)
const taskController = require("../controllers/taskController");

const router = Router();

// -----------------------------------------------------------
// RUTA PRINCIPAL: GET /api/users/:userId/tasks
// -----------------------------------------------------------
// Esta es la ruta del REQUERIMIENTO 1: "Visualización de Tareas por Usuario"
//
// ¿Cómo se lee esta URL?
// /api/users/:userId/tasks
//             ↑ esto es dinámico, cambia según el usuario
//
// Ejemplos:
//   GET /api/users/1/tasks → tareas del usuario 1
//   GET /api/users/3/tasks → tareas del usuario 3
//
// El controlador extraerá el userId con req.params.userId
// -----------------------------------------------------------
router.get("/:userId/tasks", taskController.getTasksByUser);
//           ↑ :userId es el parámetro dinámico

// -----------------------------------------------------------
// 📤 EXPORTAMOS el router
// -----------------------------------------------------------
module.exports = router;
