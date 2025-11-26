import { comentarioSchema } from "../schemas/comentario_schema.js";

export const validarComentarios = (req, res, next) => {
  const parseResult = comentarioSchema.safeParse(req.body);

  if (!parseResult.success) { const errores = parseResult.error.issues.map((e) => ({
      campo: e.path.join("."),
      mensaje: e.message
    }));

   return res.status(400).json({ success: false, message: "Error de validación en el comentario",
      errors: errores
    });
  }

  req.validated = parseResult.data;
  next();
};
