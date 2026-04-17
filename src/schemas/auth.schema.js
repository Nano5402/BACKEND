import { z } from 'zod';

export const loginSchema = z.object({
  document: z.string({
    required_error: "El documento es obligatorio",
    invalid_type_error: "El documento debe ser un texto",
  }).min(5, "El documento debe tener al menos 5 caracteres"),
  
  password: z.string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser un texto",
  }).min(6, "La contraseña debe tener al menos 6 caracteres"),
  
}).strict("No se permiten campos adicionales en el inicio de sesión");