
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({required_error: "El nombre es obligatorio", invalid_type_error: "El nombre debe ser un texto"})
    .trim()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),

  email: z
    .string({required_error: "El email es obligatorio", invalid_type_error: "El email debe ser un texto"})
    .trim()
    .email({ message: "El correo electrónico no es válido" }),

  password: z
    .string({required_error: "La contraseña es obligatoria"})
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),

  telefono: z
    .string()
    .trim()
    .max(20, { message: "El teléfono no puede tener más de 20 caracteres" })
    .optional(),

  about: z
    .string()
    .trim()
    .max(255, { message: "La descripción no puede tener más de 255 caracteres" })
    .optional()
});


export const validateLogin = z.object({email: z.string({required_error: "El email es obligatorio"})
    .trim()
    .email({ message: "El correo electrónico no es válido" }),

  password: z
    .string({required_error: "La contraseña es obligatoria"})
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
});