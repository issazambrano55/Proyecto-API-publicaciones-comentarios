// middlewares/validarComentarios.js
import { comentarioSchema } from "../schemas/comentario_schema.js";

export const validarComentarios = (req, res, next) => {
  const parseResult = comentarioSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errores = parseResult.error.issues.map((e) => ({
      campo: e.path.join("."),
      mensaje: e.message
    }));

   

  req.validated = parseResult.data;
  next();
};
