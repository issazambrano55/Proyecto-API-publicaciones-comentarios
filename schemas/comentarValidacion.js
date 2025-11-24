import { z } from "zod";

const escapeHtml = (s) => {
  if (typeof s !== "string") return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const comentarioSchema = z.object({
content: z
    .string({required_error: "El contenido es obligatorio", invalid_type_error: "El comentario debe ser un texto"})
    .trim()
    .min(1, { message: "El comentario no puede estar vacío" })
    .max(250, { message: "El comentario no puede tener mas de 250 caracteres" })
    .transform((v) => escapeHtml(v))
    .refine((v) => v.length > 0, {
      message: "El comentario no puede quedar vacío tras limpiar"
    })
});
