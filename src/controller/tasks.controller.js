const getTasks = (req, res) => {
  res.status(200).json({ 
      msn: "Aquí se listarán las tareas (Endpoint GET funcionando)" 
  });
};

const createTask = (req, res) => {
  const { userId, title, body } = req.body;
  
  res.status(201).json({ 
    msn: "Tarea creada.",
    data: {
      userId, title, body
    }
  });
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const { userId, title, body } = req.body;

  res.status(200).json({ 
      msn: `Tarea ${id} actualizada`,
      data: { userId, title, body }
  });
};

export {
  getTasks,
  createTask,
  updateTask
};