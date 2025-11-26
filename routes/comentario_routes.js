import { Router } from "express";
import {
  obtenerTodosLosComentarios,
  obtenerComentariosPorPublicacion,
  publicarComentario,
   actualizarComentarioController,
  eliminarComentarioController
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



router.put("/comentarios/:id",  verifyToken,
  validarComentarios,
  actualizarComentarioController
);


router.delete( "/comentarios/:id", verifyToken,
  eliminarComentarioController
);


export default router;
