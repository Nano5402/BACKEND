import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100).optional(),
  email: z.string().email("Formato de correo electrónico inválido").optional(),
  document: z.string().regex(/^\d+$/, "El documento solo puede contener números").optional(),
  
  // Validamos role_id en lugar de role string
  role_id: z.number({
    invalid_type_error: "El ID del rol debe ser un número"
  }).int("El ID del rol debe ser entero").positive("El ID del rol debe ser positivo").optional(),
  
  status: z.enum(["activo", "inactivo"], { 
    errorMap: () => ({ message: "El estado debe ser 'activo' o 'inactivo'" }) 
  }).optional()
}).strict("Alerta de Seguridad: No se permiten campos adicionales (como permisos) en la actualización.");

export const createUserSchema = z.object({
  name: z.string({ 
    required_error: "El nombre es obligatorio" 
  }).min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  
  email: z.string({ 
    required_error: "El email es obligatorio" 
  }).email("Formato de correo electrónico inválido"),

  document: z.string({ 
    required_error: "El documento es obligatorio" 
  }).regex(/^\d+$/, "El documento solo puede contener números, sin espacios ni letras"),
  
  // Validamos role_id
  role_id: z.number({
    invalid_type_error: "El ID del rol debe ser un número"
  }).int().positive().optional(),
  
  status: z.enum(["activo", "inactivo"], { 
    errorMap: () => ({ message: "El estado debe ser 'activo' o 'inactivo'" }) 
  }).optional()
}).strict("Alerta de Seguridad: Violación de payload. No se permiten inyecciones de datos no autorizados.");