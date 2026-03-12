// ============================================================
// 🎮 CONTROLADOR DE TAREAS — taskController.js
// ============================================================
// ¿Qué es un controlador?
// Imagina que el controlador es el GERENTE de un restaurante.
// El cliente (frontend) hace un pedido → el mesero (ruta) lo lleva
// al gerente → el gerente le dice al cocinero (modelo) qué preparar
// → el gerente recibe el plato → y lo lleva de vuelta al cliente.
//
// Responsabilidades del controlador:
//   1. Recibir los datos de la petición (req)
//   2. Validar que los datos llegaron correctamente
//   3. Llamar al modelo para obtener/procesar los datos
//   4. Enviar la respuesta HTTP al cliente (res)
// ============================================================

// Importamos el modelo de tareas
// Ahora este archivo puede usar getAll, getById, getTasksByUserId, filterTasks
const taskModel = require("../models/taskModel");

// -----------------------------------------------------------
// 🔍 CONTROLADOR 1: getAllTasks
// -----------------------------------------------------------
// Maneja la petición: GET /api/tasks
// Devuelve TODAS las tareas al administrador
// -----------------------------------------------------------
const getAllTasks = (req, res) => {
  try {
    // Pedimos al modelo todas las tareas
    const tasks = taskModel.getAll();

    // Respondemos con código 200 (OK) y las tareas en formato JSON
    // JSON es como un paquete de datos estándar que entienden todos
    res.status(200).json({
      ok: true,           // Indicador de éxito para que el frontend sepa que todo salió bien
      cantidad: tasks.length, // Cuántas tareas hay en total
      data: tasks,        // Las tareas en sí
    });
  } catch (error) {
    // Si algo sale mal (error inesperado), respondemos con 500
    res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor al obtener las tareas",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------
// 🔍 CONTROLADOR 2: getTaskById
// -----------------------------------------------------------
// Maneja la petición: GET /api/tasks/:id
// Devuelve una sola tarea específica por su ID
// -----------------------------------------------------------
const getTaskById = (req, res) => {
  try {
    // req.params contiene los valores de la URL dinámica
    // Si la URL es /api/tasks/3, entonces req.params.id = "3"
    const { id } = req.params;

    // Pedimos al modelo la tarea con ese id
    const task = taskModel.getById(id);

    // Si el modelo devolvió undefined, la tarea no existe
    if (!task) {
      // 404 = "No encontrado"
      return res.status(404).json({
        ok: false,
        mensaje: `No se encontró ninguna tarea con el ID: ${id}`,
      });
    }

    // Si la encontramos, la enviamos con código 200
    res.status(200).json({
      ok: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------
// 🔍 CONTROLADOR 3: getTasksByUser
// -----------------------------------------------------------
// Maneja la petición: GET /api/users/:userId/tasks
//
// ESTE ES EL CONTROLADOR DEL REQUERIMIENTO 1:
// "Visualización de Tareas por Usuario"
//
// Cuando un usuario quiere ver SUS tareas, llama a este endpoint.
// El :userId en la URL identifica a qué usuario pertenecen las tareas.
//
// Ejemplo de URL: /api/users/2/tasks
//                  ↑ esto es el userId = 2
// -----------------------------------------------------------
const getTasksByUser = (req, res) => {
  try {
    // Extraemos el userId de la URL
    // Si la URL es /api/users/2/tasks, req.params.userId = "2"
    const { userId } = req.params;

    // Validación: verificamos que el userId sea un número válido
    // isNaN() devuelve true si el valor NO es un número
    // Number(userId) convierte el texto a número
    if (!userId || isNaN(Number(userId))) {
      // 400 = "Bad Request" → el cliente mandó algo mal
      return res.status(400).json({
        ok: false,
        mensaje: "El ID del usuario debe ser un número válido",
      });
    }

    // Le pedimos al modelo las tareas de ese usuario
    const tasks = taskModel.getTasksByUserId(userId);

    // Respondemos con 200 aunque no haya tareas
    // (no es un error que un usuario no tenga tareas asignadas)
    res.status(200).json({
      ok: true,
      userId: Number(userId),    // Confirmamos para qué usuario es la respuesta
      cantidad: tasks.length,    // Cuántas tareas tiene asignadas
      data: tasks,               // Las tareas del usuario
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor al obtener las tareas del usuario",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------
// 🔍 CONTROLADOR 4: filterTasks
// -----------------------------------------------------------
// Maneja la petición: GET /api/tasks/filter
//
// ESTE ES EL CONTROLADOR DEL REQUERIMIENTO 2:
// "Filtrado de Tareas por Usuario"
//
// El administrador puede filtrar usando parámetros en la URL.
// Estos parámetros se llaman "query params" y van así:
// /api/tasks/filter?userId=1&estado=pendiente&prioridad=alta
//                   ↑ después del "?" van los filtros separados por "&"
//
// req.query es el objeto que Express arma con esos parámetros:
// { userId: "1", estado: "pendiente", prioridad: "alta" }
// -----------------------------------------------------------
const filterTasks = (req, res) => {
  try {
    // req.query contiene todos los parámetros de búsqueda de la URL
    // Si el admin no mandó ningún filtro, req.query es un objeto vacío {}
    const { userId, estado, prioridad, fechaDesde, fechaHasta } = req.query;

    // Validación: si se mandó un estado, verificamos que sea uno de los permitidos
    const estadosValidos = ["pendiente", "en_progreso", "completada"];
    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({
        ok: false,
        mensaje: `Estado inválido. Los estados válidos son: ${estadosValidos.join(", ")}`,
      });
    }

    // Validación: si se mandó una prioridad, verificamos que sea válida
    const prioridadesValidas = ["baja", "media", "alta"];
    if (prioridad && !prioridadesValidas.includes(prioridad)) {
      return res.status(400).json({
        ok: false,
        mensaje: `Prioridad inválida. Las prioridades válidas son: ${prioridadesValidas.join(", ")}`,
      });
    }

    // Le pasamos todos los filtros al modelo
    // Si alguno es undefined (no fue enviado), el modelo lo ignorará
    const tasks = taskModel.filterTasks({
      userId,
      estado,
      prioridad,
      fechaDesde,
      fechaHasta,
    });

    // Armamos un objeto que describe qué filtros se aplicaron
    // Esto es útil para que el frontend muestre al usuario lo que buscó
    const filtrosAplicados = {};
    if (userId) filtrosAplicados.userId = Number(userId);
    if (estado) filtrosAplicados.estado = estado;
    if (prioridad) filtrosAplicados.prioridad = prioridad;
    if (fechaDesde) filtrosAplicados.fechaDesde = fechaDesde;
    if (fechaHasta) filtrosAplicados.fechaHasta = fechaHasta;

    res.status(200).json({
      ok: true,
      filtrosAplicados,      // Le decimos al admin qué filtros usó
      cantidad: tasks.length, // Cuántas tareas coinciden con los filtros
      data: tasks,            // Las tareas filtradas
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor al filtrar las tareas",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------
// 📤 EXPORTAMOS todos los controladores
// -----------------------------------------------------------
// Así las rutas pueden usar estas funciones
// -----------------------------------------------------------
module.exports = {
  getAllTasks,
  getTaskById,
  getTasksByUser,
  filterTasks,
};
