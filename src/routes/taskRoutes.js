// ============================================================
// 🗺️ RUTAS DE TAREAS — taskRoutes.js
// ============================================================
// ¿Qué son las rutas?
// Imagina que las rutas son como las SEÑALES DE TRÁNSITO del sistema.
// Cuando llega una petición a la URL "/api/tasks/filter",
// la ruta sabe exactamente a qué controlador dirigirla.
//
// Las rutas SOLO dirigen el tráfico. No procesan datos.
// Toda la lógica vive en el controlador.
// ============================================================

// Importamos Router de Express
// Router es una mini-aplicación de Express que solo maneja rutas
// Es como un tablero de control solo para rutas
const { Router } = require("express");

// Importamos el controlador de tareas
// Así las rutas pueden llamar a las funciones del controlador
const taskController = require("../controllers/taskController");

// Creamos una instancia del Router
// Es como crear una nueva "sección" de rutas
const router = Router();

// -----------------------------------------------------------
// ⚠️ ORDEN IMPORTANTE: /filter ANTES que /:id
// -----------------------------------------------------------
// Express lee las rutas DE ARRIBA HACIA ABAJO.
// Si ponemos /:id primero, Express pensaría que "filter"
// es un ID de tarea → Error.
// Por eso "/filter" SIEMPRE debe ir antes que "/:id"
// -----------------------------------------------------------

// -----------------------------------------------------------
// RUTA 1: GET /api/tasks/filter
// -----------------------------------------------------------
// Esta es la ruta del REQUERIMIENTO 2: "Filtrado de Tareas"
//
// El admin puede buscar tareas con filtros en la URL:
// GET /api/tasks/filter?estado=pendiente
// GET /api/tasks/filter?userId=1&prioridad=alta
// GET /api/tasks/filter?fechaDesde=2025-03-01&fechaHasta=2025-03-10
// GET /api/tasks/filter (sin filtros = devuelve todas)
// -----------------------------------------------------------
router.get("/filter", taskController.filterTasks);
//          ↑ URL      ↑ Función del controlador que se ejecuta

// -----------------------------------------------------------
// RUTA 2: GET /api/tasks
// -----------------------------------------------------------
// Devuelve todas las tareas. Solo para el administrador.
// -----------------------------------------------------------
router.get("/", taskController.getAllTasks);

// -----------------------------------------------------------
// RUTA 3: GET /api/tasks/:id
// -----------------------------------------------------------
// Los dos puntos (:) significan que es un parámetro dinámico.
// Si llega GET /api/tasks/3 → req.params.id = "3"
// Si llega GET /api/tasks/5 → req.params.id = "5"
// -----------------------------------------------------------
router.get("/:id", taskController.getTaskById);

// -----------------------------------------------------------
// 📤 EXPORTAMOS el router
// -----------------------------------------------------------
// app.js importará este router y lo montará en "/api/tasks"
// -----------------------------------------------------------
module.exports = router;
