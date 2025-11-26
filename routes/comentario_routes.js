import { Router } from "express";
import { obtenerTodosLosComentarios} from "../controllers/comentario_controllers.js";
import {obtenerComentariosPorPublicacion} from "../controllers/comentario_controllers.js";
import {publicarComentario} from "../controllers/comentario_controllers.js";
import { verifyToken } from "../middlewares/verify_token.js";
import { validarComentarios } from "../middlewares/validarComentarios.js";

const router = Router();


router.get("/comentarios", obtenerTodosLosComentarios);


router.get( "/publicaciones/:id/comentarios", obtenerComentariosPorPublicacion
);


router.post( "/publicaciones/:id/comentarios",
  verifyToken,
  validarComentarios,
  publicarComentario
);

export default router;
