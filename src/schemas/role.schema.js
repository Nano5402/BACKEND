import { z } from 'zod';

export const createRoleSchema = z.object({
    name: z.string({
        required_error: "El nombre del rol es obligatorio",
        invalid_type_error: "El nombre debe ser texto"
    }).min(3, "El nombre debe tener al menos 3 caracteres"),
    
    description: z.string({
        invalid_type_error: "La descripción debe ser texto"
    }).max(255, "La descripción excede el límite permitido").optional(),
    
    // Validamos que los permisos sean un arreglo de IDs numéricos
    permissions: z.array(z.number().int().positive(), {
        invalid_type_error: "Los permisos deben ser un arreglo de IDs numéricos"
    }).optional()
}).strict("Inyección de datos detectada: No se permiten campos adicionales en el rol.");