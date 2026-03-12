# Notas de Integración y Refactorización (Para Fer)
**Por: Andrés Santiago**

¡Hola Fer! Revisé tu Pull Request con los requerimientos que te tocaron (Visualización de Tareas por Usuario y Filtrado de Tareas). La lógica de negocio que construiste para filtrar las fechas, prioridades y usuarios está excelente y cumple al 100% con lo que nos pidieron.

Sin embargo, al momento de hacer el *merge* (fusión) con la rama principal, tuvimos unos conflictos estructurales porque yo ya había configurado el sistema de seguridad, los tokens y la base de datos simulada. 

Para que todo funcione en conjunto, tuve que refactorizar tu código e integrarlo a la arquitectura actual. Dejé tus archivos originales intactos (aunque inactivos) para que puedas verlos y comparemos. Aquí te explico los cambios que hice y el porqué de cada uno:

## 1. Archivos HTML (`admin-tasks.html` y `user-tasks.html`)
* **¿Qué pasó?** Tus archivos HTML están muy bien estructurados, pero en un entorno real, **el backend y el frontend no viven juntos**. 
* **¿Por qué el cambio?** Nuestro servidor Express (Backend) solo debe dedicarse a recibir peticiones y devolver datos crudos en formato JSON. Las interfaces gráficas (HTML/CSS/JS) le corresponden al Frontend (probablemente a Isa o a nosotros en otra fase). Dejar los HTML aquí rompe la arquitectura cliente-servidor, por eso no los estamos utilizando para renderizar las rutas.

## 2. El modelo de datos (`taskModel.js`) vs `json-server`
* **¿Qué pasó?** En tu archivo `taskModel.js` guardaste las tareas en un arreglo local (en memoria). 
* **¿Por qué el cambio?** El problema de usar un arreglo local es que cada vez que reiniciamos `nodemon` o el servidor, todos los datos nuevos se borran. En mi rama yo ya había implementado `json-server`, que actúa como una base de datos real leyendo y escribiendo en nuestro `db.json`. 
* **Solución:** Tomé tu excelente lógica de filtrado y la moví a nuestro `tasks.controller.js`, pero la modifiqué para que primero haga un `fetch` a nuestro `json-server` y luego aplique tus filtros sobre esos datos reales.

## 3. Estándar de Importaciones (`require` vs `import`)
* **¿Qué pasó?** Hubo un conflicto fuerte en `app.js` porque tu código utilizaba CommonJS (`require` / `module.exports`), mientras que el proyecto base lo configuramos con ES Modules (`import` / `export`).
* **¿Por qué el cambio?** Node.js moderno utiliza `import` (como en React o Angular). Al tener ambos métodos mezclados, el servidor explotaba. Actualicé la sintaxis de tus controladores y rutas para que usen `import`.

## 4. `server.js` y `app.js`
* **¿Qué pasó?** Separaste el encendido del servidor en `server.js`. Es una buena práctica, pero para la escala de nuestro proyecto actual, tener todo centralizado en `app.js` nos evita problemas con el script de arranque en el `package.json`. Por ahora, mantuve todo centralizado en `app.js`.

## 5. La Seguridad y el arreglo `userIds`
* **¿Qué pasó?** Ahora nuestro sistema exige estar logueado para hacer peticiones.
* **Solución:** Agregué tus rutas a nuestros archivos `tasks.routes.js` y `users.routes.js` y les puse mis middlewares de seguridad (`verifyToken` e `isAdmin`). Además, recuerda que ahora las tareas no tienen un solo `usuarioAsignado`, sino un arreglo llamado `userIds` para soportar la asignación múltiple. Tu función de filtrado ya la actualicé para que busque dentro de ese arreglo.

¡Gran trabajo con la lógica de los filtros! Échale un ojo a `src/controllers/tasks.controller.js` para que veas cómo quedó tu código integrado con la base de datos real y los tokens.