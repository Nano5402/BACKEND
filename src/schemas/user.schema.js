import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100).optional(),
  email: z.string().email("Formato de correo inválido").optional(),
  document: z.string().regex(/^\d+$/, "El documento debe ser numérico").optional(),
}).strict("No se permiten campos adicionales");