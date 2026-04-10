export const updateUserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100).optional(),
  email: z.string().email("Formato de correo inválido").optional(),
  document: z.string().regex(/^\d+$/, "El documento solo puede contener números").optional(),
  role: z.enum(["user", "admin"], { errorMap: () => ({ message: "El rol debe ser 'user' o 'admin'" }) }).optional(),
  status: z.enum(["activo", "inactivo"]).optional()
}).strict();

import { z } from 'zod';