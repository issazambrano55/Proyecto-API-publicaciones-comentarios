import { z } from "zod";
const emptyToNull = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  return String(value).trim();
};

export const publicacionSchema = z.object({
  title: z
    .string({
      required_error: "El titulo es obligatorio",
      invalid_type_error: "El titulo debe ser un texto"
    })
    .min(3, { message: "El titulo debe tener al menos 3 caracteres" })
    .max(255, { message: "El titulo no debe superar 255 caracteres" })
    .transform((v) => v.trim()),

  content: z
    .string({
      required_error: "El contenido es obligatorio",
      invalid_type_error: "El contenido debe ser un texto"
    })
    .min(10, { message: "El contenido debe tener al menos 10 caracteres" })
    .max(5000, { message: "El contenido no debe superar 5000 caracteres" })
    .transform((v) => v.trim()),
  image: z
    .string()
    .transform(emptyToNull)
    .nullable()
    .optional()
    .refine(
      (v) => v === null || /^https?:\/\/.+/i.test(v),
      { message: "La imagen debe ser una URL válida (http o https)" }
    ),
  category_title: z
    .string({
      required_error: "La categoria es obligatoria",
      invalid_type_error: "La categoria debe ser un texto"
    })
    .min(3, { message: "La categoria debe tener al menos 3 caracteres" })
    .max(255, { message: "La categoria no debe superar 255 caracteres" })
    .transform((v) => v.trim())
});