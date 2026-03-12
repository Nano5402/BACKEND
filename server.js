// ============================================================
// 🚀 PUNTO DE ENTRADA — server.js
// ============================================================
// Este archivo es el primero que se ejecuta cuando escribes:
// node server.js
//
// Su única responsabilidad es: ARRANCAR el servidor.
// No configura rutas ni middlewares — eso ya lo hace app.js
//
// Analogía: server.js es la LLAVE que enciende el motor (app.js)
// ============================================================

// Importamos la app configurada en app.js
const app = require("./app");

// Puerto donde el servidor estará escuchando
// process.env.PORT → si hay una variable de entorno configurada (en producción)
// || 3000 → si no hay variable de entorno, usamos 3000 por defecto
const PORT = process.env.PORT || 3000;

// .listen() inicia el servidor en el puerto indicado
// El segundo argumento es un callback que se ejecuta cuando el servidor está listo
app.listen(PORT, () => {
  console.log("====================================");
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log("====================================");
  console.log("📌 Endpoints disponibles:");
  console.log(`   GET http://localhost:${PORT}/api/tasks`);
  console.log(`   GET http://localhost:${PORT}/api/tasks/filter`);
  console.log(`   GET http://localhost:${PORT}/api/tasks/:id`);
  console.log(`   GET http://localhost:${PORT}/api/users/:userId/tasks`);
  console.log("====================================");
});
