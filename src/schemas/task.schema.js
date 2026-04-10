import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string({ required_error: "El título es obligatorio" }).min(5, "Mínimo 5 caracteres").max(100),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  userId: z.number({ 
    required_error: "El userId es obligatorio", 
    invalid_type_error: "El userId debe ser un número" 
  }).int().positive("El ID debe ser positivo")
}).strict();