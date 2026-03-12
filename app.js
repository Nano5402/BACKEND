// ============================================================
// ⚙️ CONFIGURACIÓN PRINCIPAL DE EXPRESS — app.js
// ============================================================
// Este es el archivo central de la aplicación.
// Aquí se configura Express y se registran todas las rutas.
//
// Analogía: es como el tablero eléctrico de una casa.
// Desde aquí se conectan y distribuyen todos los "cables" (rutas)
// hacia los distintos cuartos (controladores y modelos).
// ============================================================

// Importamos Express — el framework que nos permite crear el servidor
const express = require("express");

// Importamos las rutas que creamos
// Cada archivo de rutas maneja un "recurso" diferente
const taskRoutes = require("./src/routes/taskRoutes");
const userRoutes = require("./src/routes/userRoutes");

// Creamos la aplicación Express
// app es el objeto principal que representa nuestro servidor
const app = express();

// -----------------------------------------------------------
// 🔧 MIDDLEWARES GLOBALES
// -----------------------------------------------------------
// Un middleware es una función que se ejecuta ANTES de que
// llegue la petición al controlador. Procesa o transforma
// la petición en el camino.
// -----------------------------------------------------------

// express.json() → permite que Express entienda el cuerpo de
// las peticiones en formato JSON (ej: cuando el frontend manda
// datos con POST o PUT)
// Sin esto, req.body sería undefined.
app.use(express.json());

// express.static() → le dice a Express que sirva archivos
// estáticos (HTML, CSS, JS del frontend) desde la carpeta "public"
// Así cuando el navegador pide /index.html, Express lo busca ahí
app.use(express.static("public"));

// -----------------------------------------------------------
// 🗺️ REGISTRO DE RUTAS
// -----------------------------------------------------------
// app.use(prefijo, router) → monta un router en una ruta base
//
// Todo lo que empiece con "/api/tasks" lo manejará taskRoutes
// Todo lo que empiece con "/api/users" lo manejará userRoutes
// -----------------------------------------------------------
app.use("/api/tasks", taskRoutes);
// Ejemplo: GET /api/tasks/filter → taskRoutes → controller.filterTasks

app.use("/api/users", userRoutes);
// Ejemplo: GET /api/users/2/tasks → userRoutes → controller.getTasksByUser

// -----------------------------------------------------------
// 🚦 RUTA DE BIENVENIDA (para verificar que el servidor corre)
// -----------------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    ok: true,
    mensaje: "¡Servidor Express funcionando correctamente!",
    endpoints: [
      "GET /api/tasks               → Todas las tareas",
      "GET /api/tasks/filter        → Filtrar tareas",
      "GET /api/tasks/:id           → Una tarea específica",
      "GET /api/users/:userId/tasks → Tareas de un usuario",
    ],
  });
});

// -----------------------------------------------------------
// 🔴 RUTA DE ERROR 404 (ruta no encontrada)
// -----------------------------------------------------------
// Si ninguna ruta coincidió, respondemos con 404
// Este middleware siempre va AL FINAL
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: `La ruta ${req.method} ${req.url} no existe en este servidor`,
  });
});

// -----------------------------------------------------------
// 📤 EXPORTAMOS app
// -----------------------------------------------------------
// server.js importará esto para iniciar el servidor
module.exports = app;
