import { Router } from "express";
import {
  obtenerTodosLosComentarios,
  obtenerComentariosPorPublicacion,
  publicarComentario
} from "../controllers/comentario_controllers.js";

import { verifyToken } from "../middlewares/verify_token.js";
import { validarComentarios } from "../middlewares/validarComentarios.js";

const router = Router();

router.get("/comentarios", obtenerTodosLosComentarios);
router.get( "/publicaciones/:id/comentarios", obtenerComentariosPorPublicacion
);

router.post( "/publicaciones/:id/comentarios", verifyToken, validarComentarios,
  publicarComentario
);

export default router;
