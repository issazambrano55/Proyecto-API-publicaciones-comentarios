import { Router } from "express";
import { verifyToken } from "../middlewares/verify_token.js";

import {listarPublicaciones, obtenerPublicacion, crearPublicacionController,
actualizarPublicacionController, eliminarPublicacionController, listarCategorias
} from "../controllers/publicacion_controller.js";

const router = Router();

router.get("/", listarPublicaciones);
router.get("/:id", obtenerPublicacion);
router.post("/", verifyToken, crearPublicacionController);
router.put("/:id", verifyToken, actualizarPublicacionController);
router.delete("/:id", verifyToken, eliminarPublicacionController);
router.get("/categorias/listar", listarCategorias);

export default router;