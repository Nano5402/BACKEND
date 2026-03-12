// ============================================================
// 📦 MODELO DE TAREAS — taskModel.js
// ============================================================
// ¿Qué es un modelo?
// Imagina una bodega de datos. El modelo es el ALMACENISTA:
// sabe dónde está todo, cómo buscarlo y cómo entregarlo.
// El controlador le hace el pedido, y el modelo lo cumple.
// El modelo NUNCA habla directamente con el cliente (no usa res.json).
// ============================================================

// -----------------------------------------------------------
// 🗃️ BASE DE DATOS SIMULADA (Array en memoria)
// -----------------------------------------------------------
// Como aún no usamos una base de datos real (como MongoDB o MySQL),
// guardamos los datos en un array de objetos JavaScript.
// Cada objeto representa una tarea del sistema.
// -----------------------------------------------------------
const tasks = [
  {
    id: 1,
    titulo: "Diseñar la pantalla de login",
    descripcion: "Crear el wireframe y el HTML del formulario de inicio de sesión",
    estado: "completada",       // Estados posibles: "pendiente", "en_progreso", "completada"
    prioridad: "alta",          // Prioridades: "baja", "media", "alta"
    fechaCreacion: "2025-03-01",
    usuariosAsignados: [1, 2],  // IDs de los usuarios que tienen esta tarea
  },
  {
    id: 2,
    titulo: "Crear rutas del backend",
    descripcion: "Implementar los endpoints de la API REST con Express",
    estado: "en_progreso",
    prioridad: "alta",
    fechaCreacion: "2025-03-05",
    usuariosAsignados: [2],
  },
  {
    id: 3,
    titulo: "Escribir pruebas con Postman",
    descripcion: "Probar todos los endpoints documentados en la guía",
    estado: "pendiente",
    prioridad: "media",
    fechaCreacion: "2025-03-08",
    usuariosAsignados: [1, 3],
  },
  {
    id: 4,
    titulo: "Configurar el servidor en producción",
    descripcion: "Subir el proyecto a un servidor en la nube",
    estado: "pendiente",
    prioridad: "baja",
    fechaCreacion: "2025-03-10",
    usuariosAsignados: [3],
  },
  {
    id: 5,
    titulo: "Revisar la documentación del proyecto",
    descripcion: "Leer y completar la guía de aprendizaje SENA",
    estado: "completada",
    prioridad: "media",
    fechaCreacion: "2025-02-28",
    usuariosAsignados: [1, 2, 3],
  },
];

// -----------------------------------------------------------
// 🔍 MÉTODO 1: getAll()
// -----------------------------------------------------------
// Retorna TODAS las tareas sin ningún filtro.
// Lo usa el administrador para ver el panel global.
// -----------------------------------------------------------
const getAll = () => {
  return tasks; // Devuelve el array completo
};

// -----------------------------------------------------------
// 🔍 MÉTODO 2: getById(id)
// -----------------------------------------------------------
// Busca una tarea específica usando su ID.
// .find() recorre el array y devuelve el primer elemento
// que cumpla la condición (task.id === id).
// Si no encuentra nada, devuelve undefined.
// -----------------------------------------------------------
const getById = (id) => {
  // Convertimos 'id' a número porque los parámetros de URL llegan como texto ("1", "2"...)
  return tasks.find((task) => task.id === Number(id));
};

// -----------------------------------------------------------
// 🔍 MÉTODO 3: getTasksByUserId(userId)
// -----------------------------------------------------------
// Aquí está la magia del Requerimiento 1:
// "Visualización de Tareas por Usuario"
//
// Imagina que cada tarea tiene una lista de invitados (usuariosAsignados).
// Este método busca todas las tareas donde el userId
// aparece en esa lista de invitados.
//
// .filter() recorre el array y devuelve un NUEVO array
// solo con los elementos que cumplan la condición.
//
// .includes() verifica si un valor existe dentro de un array.
// Ejemplo: [1, 2, 3].includes(2) → true
// -----------------------------------------------------------
const getTasksByUserId = (userId) => {
  // Convertimos userId a número para comparar correctamente
  const id = Number(userId);

  // Filtramos: nos quedamos solo con las tareas donde
  // el array usuariosAsignados contiene el id buscado
  return tasks.filter((task) => task.usuariosAsignados.includes(id));
};

// -----------------------------------------------------------
// 🔍 MÉTODO 4: filterTasks(filtros)
// -----------------------------------------------------------
// Aquí está la magia del Requerimiento 2:
// "Filtrado de Tareas por Usuario"
//
// Este método recibe un objeto con los criterios de filtrado:
// { userId, estado, prioridad, fechaDesde, fechaHasta }
//
// Aplica CADA filtro si fue enviado. Si no se envía un filtro,
// simplemente lo ignora y devuelve todas las tareas.
//
// Analogía: es como una búsqueda avanzada en una tienda online.
// Si buscas por "color: rojo" filtra por rojo.
// Si no pones color, muestra todos.
// -----------------------------------------------------------
const filterTasks = ({ userId, estado, prioridad, fechaDesde, fechaHasta }) => {
  // Empezamos con TODAS las tareas
  let resultado = [...tasks]; // El "..." crea una copia del array original

  // ------- FILTRO 1: Por usuario -------
  // Si llegó un userId, filtramos solo las tareas de ese usuario
  if (userId) {
    const id = Number(userId);
    resultado = resultado.filter((task) =>
      task.usuariosAsignados.includes(id)
    );
  }

  // ------- FILTRO 2: Por estado -------
  // Si llegó un estado (ej: "pendiente"), filtramos por ese estado
  if (estado) {
    resultado = resultado.filter((task) => task.estado === estado);
  }

  // ------- FILTRO 3: Por prioridad -------
  // Si llegó una prioridad (ej: "alta"), filtramos por esa prioridad
  if (prioridad) {
    resultado = resultado.filter((task) => task.prioridad === prioridad);
  }

  // ------- FILTRO 4: Por rango de fechas (desde) -------
  // Si llegó una fecha de inicio, excluimos tareas anteriores a esa fecha
  if (fechaDesde) {
    resultado = resultado.filter(
      (task) => new Date(task.fechaCreacion) >= new Date(fechaDesde)
    );
  }

  // ------- FILTRO 5: Por rango de fechas (hasta) -------
  // Si llegó una fecha límite, excluimos tareas posteriores a esa fecha
  if (fechaHasta) {
    resultado = resultado.filter(
      (task) => new Date(task.fechaCreacion) <= new Date(fechaHasta)
    );
  }

  // Retornamos el array ya filtrado
  return resultado;
};

// -----------------------------------------------------------
// 📤 EXPORTAR los métodos del modelo
// -----------------------------------------------------------
// module.exports hace que estas funciones estén disponibles
// para otros archivos que hagan: require('./taskModel')
// Es como un menú del almacenista: "esto es lo que ofrezco"
// -----------------------------------------------------------
module.exports = {
  getAll,
  getById,
  getTasksByUserId,
  filterTasks,
};
