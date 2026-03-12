import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

// Rutas base con el prefijo exigido
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.status(200).json({ msn: "Servidor Express funcionando correctamente" });
}); 

// Manejo de error 404 (Idea de Fernando)
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    msn: `La ruta ${req.method} ${req.url} no existe en este servidor`
  });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});